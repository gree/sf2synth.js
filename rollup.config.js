import typescript from 'rollup-plugin-typescript'
import serve from 'rollup-plugin-serve'

function create(name) {
  return {
    name: `SoundFont`,
    input: `export/${name}.ts`,
    plugins: [
      typescript({ typescript: require("typescript") })
    ],
    output: [
      {
        file: `public/js/sf2.${name}.js`,  
        format: "umd",
      },
      {
        file: `public/js/sf2.${name}.esm.js`,
        format: "es"
      }
    ]
  };
}

export default [
  create("parser"),
  create("synth")
];

serve('dist');