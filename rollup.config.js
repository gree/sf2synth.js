import typescript from "rollup-plugin-typescript"

function create(name) {
  return {
    name: `SoundFont`,
    input: `export/${name}.ts`,
    plugins: [
      typescript({ typescript: require("typescript") })
    ],
    output: [
      {
        file: `bin/sf2.${name}.js`,  
        format: "umd",
      },
      {
        file: `bin/sf2.${name}.esm.js`,
        format: "es"
      }
    ]
  }
}

export default [
  create("parser"),
  create("synth")
]
