
document.addEventListener("DOMContentLoaded", function() {
    fetch("movies.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            transformXML(xml);
        });
});

function transformXML(xml) {
    fetch("movies.xsl")
        .then(response => response.text())
        .then(xslData => {
            const parser = new DOMParser();
            const xsl = parser.parseFromString(xslData, "text/xml");
            
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            
            const resultDocument = xsltProcessor.transformToFragment(xml, document);
            document.getElementById("movie-list").appendChild(resultDocument);
        });
}

function queryMovies() {
    const query = document.getElementById("xpathQuery").value;
    fetch("movies.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const result = xml.evaluate(query, xml, null, XPathResult.ANY_TYPE, null);
            
            let output = "<h3>Query Results:</h3><ul>";
            let node = result.iterateNext();
            while (node) {
                output += `<li>${node.textContent}</li>`;
                node = result.iterateNext();
            }
            output += "</ul>";
            document.getElementById("query-result").innerHTML = output;
        });
}
