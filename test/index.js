import React from "react/addons";
import sd from "skin-deep";
import sinon from "sinon";
import expect from "expect";
import {configDefaults, labelsDefaults, queryDefaults} from "../src/defaults";
import queriesReducer from "../src/reducers/queries";
import FacetedSearch from "../src";

let getTree = (props={}) => {
	// Make sure config is defined, because it is a required prop.
	props = Object.assign({config: {}}, props);
	return sd.shallowRender(<FacetedSearch {...props}/>);
};

let getRenderOutput = (props) =>
	getTree(props).getRenderOutput();

let getMountedInstance = (props) =>
	getTree(props).getMountedInstance();

/* eslint no-undef:0 */
describe("FacetedSearch", function() {

	beforeEach(() => {
		queriesReducer(undefined, {type: "SET_QUERY_DEFAULTS"});
	});

	it("should update the facetValues in the query prop with componentWillReceiveProps", function() {
		const tree = sd.shallowRender(<FacetedSearch config={{}} />);
		const search = tree.getMountedInstance();
		const labels = search.state.labels;

		sinon.stub(search, "setQuery", function(nextQuery) {
			expect(nextQuery).toEqual({ facetValues: [ { name: "foo", values: ["bar"] } ] });
		});

		search.componentWillReceiveProps({
			labels: labels,
			query: {facetValues: [{name: "foo", values: ["bar"]}]}
		});

		sinon.assert.calledOnce(search.setQuery);
		search.setQuery.restore();
	});

	it("should not update the query with setQuery when facetValues are the same", function() {
		const search = getMountedInstance({query: {facetValues: [{name: "foo", values: ["bar"]}]}});
		const query = {...search.state.queries.last};
		sinon.stub(search.store, "dispatch");

		search.setQuery(query);
		sinon.assert.notCalled(search.store.dispatch);
		search.store.dispatch.restore();
	});

	it("should not update the fullTextSearchParameters with setQuery when fullTextSearchParameters are the same", function() {
		const tree = sd.shallowRender(<FacetedSearch config={{}} />);
		const search = tree.getMountedInstance();
		const query = {...search.state.queries.last, fullTextSearchParameters: [{name: "foo", term: "bar"}]};

		search.state.queries.last.fullTextSearchParameters = [{name: "foo", term: "bar"}];

		sinon.stub(search.store, "dispatch");

		search.setQuery(query);

		sinon.assert.notCalled(search.store.dispatch);
		search.store.dispatch.restore();
	});

	it("should update the fullTextSearchParameters in the query prop with setQuery", function() {
		const tree = sd.shallowRender(<FacetedSearch config={{}} />);
		const search = tree.getMountedInstance();
		const localDispatch = function(dispatchData) {
			if(typeof dispatchData === "object") {
				expect(dispatchData).toEqual({
					type: "SET_FULL_TEXT_SEARCH_TERMS",
					fullTextSearchParameters: [{name: "foo", term: "bar2"}]
				});
			}
		};

		sinon.stub(search.store, "dispatch", function(cb) {
			cb(localDispatch);
		});

		search.setQuery({fullTextSearchParameters: [{name: "foo", term: "bar2"}]});

		sinon.assert.calledOnce(search.store.dispatch);
		search.store.dispatch.restore();
	});

	it("should unset the fullTextSearchParameters when an empty array is passed through the query prop", function() {
		const tree = sd.shallowRender(<FacetedSearch config={{}} />);
		const search = tree.getMountedInstance();
		search.state.queries.last.fullTextSearchParameters = ":having_a_value:";

		const localDispatch = function(dispatchData) {
			if(typeof dispatchData === "object") {
				expect(dispatchData).toEqual({
					type: "REMOVE_FULL_TEXT_SEARCH_TERMS"
				});
			}
		};

		sinon.stub(search.store, "dispatch", function(cb) {
			cb(localDispatch);
		});

		search.setQuery({fullTextSearchParameters: []});

		sinon.assert.calledOnce(search.store.dispatch);
		search.store.dispatch.restore();
	});

	it("should add a custom className when given als prop", () => {
		const fs = getRenderOutput({className: "custom-classname"});

		expect(fs.props.className).toEqual("hire-faceted-search custom-classname");
	});

	it("should add config prop to default config", () => {
		const configProp = {
			rows: 51,
			test: 3
		};
		const expectedConfig = Object.assign(configDefaults, configProp);
		const fs = getMountedInstance({config: configProp});

		expect(fs.state.config).toEqual(expectedConfig);
	});

	it("should add labels prop to default labels", () => {
		const labelsProp = {
			newSearch: "Noaw seersh",
			showAll: "Shawl oawhl"
		};
		const expectedLabels = Object.assign(labelsDefaults, labelsProp);
		const fs = getMountedInstance({labels: labelsProp});

		expect(fs.state.labels).toEqual(expectedLabels);
	});

	it("should have default query when no queryDefaults are passed as props", () => {
		const fs = getMountedInstance();
		expect(fs.state.queries.default).toEqual(queryDefaults);
	});
});