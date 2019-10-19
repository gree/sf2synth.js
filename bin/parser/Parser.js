import { parseRiff } from "./RiffParser";
import { PresetHeader, SampleHeader, PresetBag, Instrument, InstrumentBag, ModulatorList, GeneratorList, Info } from "./Structs";
import Stream from "./Stream";
export default function parse(input, option = {}) {
    // parse RIFF chunk
    const chunkList = parseRiff(input, 0, input.length, option);
    if (chunkList.length !== 1) {
        throw new Error('wrong chunk length');
    }
    const chunk = chunkList[0];
    if (chunk === null) {
        throw new Error('chunk not found');
    }
    function parseRiffChunk(chunk, data) {
        const chunkList = getChunkList(chunk, data, "RIFF", "sfbk");
        if (chunkList.length !== 3) {
            throw new Error('invalid sfbk structure');
        }
        return Object.assign({ 
            // INFO-list
            info: parseInfoList(chunkList[0], data), 
            // sdta-list
            samplingData: parseSdtaList(chunkList[1], data) }, parsePdtaList(chunkList[2], data));
    }
    function parsePdtaList(chunk, data) {
        const chunkList = getChunkList(chunk, data, "LIST", "pdta");
        // check number of chunks
        if (chunkList.length !== 9) {
            throw new Error('invalid pdta chunk');
        }
        return {
            presetHeaders: parsePhdr(chunkList[0], data),
            presetZone: parsePbag(chunkList[1], data),
            presetModulators: parsePmod(chunkList[2], data),
            presetGenerators: parsePgen(chunkList[3], data),
            instruments: parseInst(chunkList[4], data),
            instrumentZone: parseIbag(chunkList[5], data),
            instrumentModulators: parseImod(chunkList[6], data),
            instrumentGenerators: parseIgen(chunkList[7], data),
            sampleHeaders: parseShdr(chunkList[8], data)
        };
    }
    const result = parseRiffChunk(chunk, input);
    return Object.assign(Object.assign({}, result), { samples: loadSample(result.sampleHeaders, result.samplingData.offset, input) });
}
function getChunkList(chunk, data, expectedType, expectedSignature) {
    // check parse target
    if (chunk.type !== expectedType) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    const stream = new Stream(data, chunk.offset);
    // check signature
    const signature = stream.readString(4);
    if (signature !== expectedSignature) {
        throw new Error('invalid signature:' + signature);
    }
    // read structure
    return parseRiff(data, stream.ip, chunk.size - 4);
}
function parseInfoList(chunk, data) {
    const chunkList = getChunkList(chunk, data, "LIST", "INFO");
    return Info.parse(data, chunkList);
}
function parseSdtaList(chunk, data) {
    const chunkList = getChunkList(chunk, data, "LIST", "sdta");
    if (chunkList.length !== 1) {
        throw new Error('TODO');
    }
    return chunkList[0];
}
function parseChunk(chunk, data, type, clazz, terminate) {
    const result = [];
    if (chunk.type !== type) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    const stream = new Stream(data, chunk.offset);
    const size = chunk.offset + chunk.size;
    while (stream.ip < size) {
        const obj = clazz.parse(stream);
        if (terminate && terminate(obj)) {
            break;
        }
        result.push(obj);
    }
    return result;
}
const parsePhdr = (chunk, data) => parseChunk(chunk, data, "phdr", PresetHeader, p => p.isEnd);
const parsePbag = (chunk, data) => parseChunk(chunk, data, "pbag", PresetBag);
const parseInst = (chunk, data) => parseChunk(chunk, data, "inst", Instrument, i => i.isEnd);
const parseIbag = (chunk, data) => parseChunk(chunk, data, "ibag", InstrumentBag);
const parsePmod = (chunk, data) => parseChunk(chunk, data, "pmod", ModulatorList, m => m.isEnd);
const parseImod = (chunk, data) => parseChunk(chunk, data, "imod", ModulatorList, m => m.isEnd);
const parsePgen = (chunk, data) => parseChunk(chunk, data, "pgen", GeneratorList, g => g.isEnd);
const parseIgen = (chunk, data) => parseChunk(chunk, data, "igen", GeneratorList);
const parseShdr = (chunk, data) => parseChunk(chunk, data, "shdr", SampleHeader, s => s.isEnd);
function adjustSampleData(sample, sampleRate) {
    let multiply = 1;
    // buffer
    while (sampleRate < 22050) {
        const newSample = new Int16Array(sample.length * 2);
        for (let i = 0, j = 0, il = sample.length; i < il; ++i) {
            newSample[j++] = sample[i];
            newSample[j++] = sample[i];
        }
        sample = newSample;
        multiply *= 2;
        sampleRate *= 2;
    }
    return {
        sample,
        multiply
    };
}
function loadSample(sampleHeader, samplingDataOffset, data) {
    return sampleHeader.map(header => {
        let sample = new Int16Array(new Uint8Array(data.subarray(samplingDataOffset + header.start * 2, samplingDataOffset + header.end * 2)).buffer);
        if (header.sampleRate > 0) {
            const adjust = adjustSampleData(sample, header.sampleRate);
            sample = adjust.sample;
            header.sampleRate *= adjust.multiply;
            header.loopStart *= adjust.multiply;
            header.loopEnd *= adjust.multiply;
        }
        return sample;
    });
}
//# sourceMappingURL=Parser.js.map