// delegates method calls to multiple targets
export default function delegateProxy<T extends Object>(targets: T[]) {
  return new Proxy(targets[0], {
    get(target, propKey, _receiver) {
      return function () {
        const args = arguments
        targets.map((t) => t[propKey].bind(target)).forEach((f) => f(...args))
      }
    },
  })
}
