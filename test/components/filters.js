import React from "react/addons";
import expect from "expect";
import Facets from "../../src/components/filters";
import TextSearch from "../../src/components/text-search";
import ListFacet from "../../src/components/list-facet";
import RangeFacet from "../../src/components/range-facet";


const { TestUtils } = React.addons;

describe("Facets", () => {
	it("should render properly", function() {

		function setup() {
			let onNewSearch = function() { return "new search clicked"; };
			let onSelectFacetValue = function() { return "onSelectFacetValue passed as prop"; };
			let onChangeSearchTerm = function() { return "onChangeSearchTerm passed as prop"; };
			let onSelectFacetRange = function() { return "onSelectFacetRange passed as prop"; };

			let props = {
				data: "mock data",
				labels: {facetTitles: { "someFacet": "mock labels"}},
				queries: {last: {term: "mock term"}},
				facetList: ["foo", "bar", "range"],
				results: {last: {facets: [{name: "foo", type: "LIST"}, {name: "bar", type: "LIST"}, {name: "do-not-show"}, {name: "range", type: "RANGE"}]}},
				onNewSearch: onNewSearch,
				onSelectFacetValue: onSelectFacetValue,
				onSelectFacetRange: onSelectFacetRange,
				onChangeSearchTerm: onChangeSearchTerm
			};
			let renderer = TestUtils.createRenderer();
			renderer.render(<Facets {...props} />);
			let output = renderer.getRenderOutput();

			return {
				props,
				output,
				renderer
			};
		}

		const { output } = setup();
		expect(output.type).toBe("ul");
		expect(output.props.className).toBe("hire-faceted-search-filters");
		expect(output.props.children.length).toBe(5);
		let [button, textSearch, ftSearchTop, childFacets, ftSearchBottom] = output.props.children;
		expect(button.type).toBe("button");
		expect(button.props.onClick()).toBe("new search clicked");
		expect(textSearch.props.value).toBe("mock term");
		expect(textSearch.props.onChangeSearchTerm()).toBe("onChangeSearchTerm passed as prop");
		expect(textSearch.type).toBe(TextSearch);
		expect(childFacets.length).toBe(3);
		let [fooFacet, barFacet, rangeFacet] = childFacets;
		expect(fooFacet.type).toBe(ListFacet);
		expect(barFacet.type).toBe(ListFacet);
		expect(rangeFacet.type).toBe(RangeFacet);
		expect(fooFacet.props.data).toEqual({name: "foo", type: "LIST"});
		expect(barFacet.props.data).toEqual({name: "bar", type: "LIST"});
		expect(fooFacet.props.labels).toEqual({facetTitles: { "someFacet": "mock labels"}});
		expect(barFacet.props.labels).toEqual({facetTitles: { "someFacet": "mock labels"}});
		expect(fooFacet.props.onSelectFacetValue()).toBe("onSelectFacetValue passed as prop");
		expect(fooFacet.props.queries).toEqual({last: {term: "mock term"}});
		expect(barFacet.props.queries).toEqual({last: {term: "mock term"}});
		expect(rangeFacet.props.data).toEqual({name: "range", type: "RANGE"});
		expect(rangeFacet.props.onSelectFacetRange()).toBe("onSelectFacetRange passed as prop");
	});

});

