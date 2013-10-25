function namespace(namespaceString) {
    /// Generic namespace function that allows developers to create namespaces
    /// <param name="namespaceString">namespace to create, i.e: "Product.Feature.Detail"</param>
    /// <returns>namespace</returns>
    var parts = namespaceString.split(".");
    var parent = window;

    $.each(parts, function (idx, part) {
        parent[part] = parent[part] || {};
        parent = parent[part];
    });
    return parent;
}