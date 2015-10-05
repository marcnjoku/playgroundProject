function createSoccerViz() {
    d3.csv("worldcup.csv", function (data) {
        overallTeamViz(data);
    });

    function overallTeamViz(incomingData) {
        d3.select("svg")
            .append("g")
            .attr("id", "teamsG")
            .attr("transform", "translate(50,300)")
            .selectAll("g")
            .data(incomingData)
            .enter()
            .append("g")
            .attr("class", "overallG")
            .attr("transform",
                function (d, i) {
                    return "translate(" + (i * 50) + ", 0)"
                }
            );
        var teamG = d3.selectAll("g.overallG");
        teamG
            .append("circle")
            .attr("r", 0)
            .transition()
            .delay(function (d, i) {
                return i * 100;
            })
            .duration(500)
            .attr("r", 40)
            .transition()
            .duration(500)
            .attr("r", 20)
            .style("fill", "pink")
            .style("stroke", "black")
            .style("stroke-width", "1px");
        teamG
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", 30)
            .style("font-size", "10px")
            .text(function (d) {
                return d.team;
            });
        teamG.select("text").style("pointer-events", "none");

        var dataKeys = d3.keys(incomingData[0]).filter(function (el) {
            return el != "team" && el != "region";
        });
        d3.select("#controls").selectAll("button.teams")
            .data(dataKeys).enter()
            .append("button")
            .on("click", buttonClick)
            .html(function (d) {
                return d;
            });
        function buttonClick(datapoint) {
            var maxValue = d3.max(incomingData, function (d) {
                return parseFloat(d[datapoint]);
            });
            var ybRamp = d3.scale.linear()
                .interpolate(d3.interpolateHsl)
                .domain([0, maxValue]).range(["yellow", "blue"]);
            var radiusScale = d3.scale.linear()
                .domain([0, maxValue]).range([2, 20]);
            d3.selectAll("g.overallG").select("circle").transition().duration(1000)
                .attr("r", function (d) {
                    return radiusScale(d[datapoint]);
                })
                .style("fill", function (d) {
                    return ybRamp(d[datapoint]);
                })
        };


        teamG.on("mouseover", highlightRegion2);
        teamG.on("mouseout", unHighlight);

        function highlightRegion(d) {
            d3.selectAll("g.overallG").select("circle")
                .style("fill", function (p) {
                    return p.region == d.region ? "red" : "gray";
                });
        }

        function highlightRegion2(d, i) {
            var teamColor = d3.rgb("pink");
            d3.select(this).select("text")
                .classed("active", true)
                .style("font-size", "40px")
                .attr("y", 10);
            d3.selectAll("g.overallG").select("circle").each(function (p, i) {
                p.region == d.region ?
                    d3.select(this).classed("active", true) :
                    d3.select(this).classed("inactive", true);
            }).style("fill", function (p) {
                return p.region == d.region ? teamColor.darker(.75) : teamColor.brighter(.5);
            });
            this.parentElement.appendChild(this);
        };

        function unHighlight() {
            d3.selectAll("g.overallG").select("circle").attr("class", "");
            d3.selectAll("g.overallG").select("text")
                .classed("highlight", false)
                .style("font-size", "10px")
                .attr("y", 30);
        };


        /*teamG.on("mouseout", function () {
         d3.selectAll("g.overallG").select("circle").style("fill", "pink");
         });*/
    }
}