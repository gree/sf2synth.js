import typescript from 'rollup-plugin-typescript'
import sourcemaps from 'rollup-plugin-sourcemaps';
import serve from 'rollup-plugin-serve'

function create(name) {
  return {
    name: `SoundFont`,
    input: `export/${name}.ts`,
    plugins: [
      typescript({
        typescript: require("typescript")
      }),
      sourcemaps()
    ],
    output: [{
        file: `public/js/sf2.${name}.js`,
        format: "umd",
      },
      {
        file: `public/js/sf2.${name}.esm.js`,
        format: "es"
      }
    ],
    sourceMap: true
  };
}

export default [
  create("parser"),
  create("synth")
];

serve('public');