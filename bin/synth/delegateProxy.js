// delegates method calls to multiple targets
export default function delegateProxy(targets) {
    return new Proxy(targets[0], {
        get(target, propKey, _receiver) {
            return () => {
                targets
                    .map(t => t[propKey].bind(target))
                    .forEach(f => f(...arguments));
            };
        }
    });
}
//# sourceMappingURL=delegateProxy.js.map