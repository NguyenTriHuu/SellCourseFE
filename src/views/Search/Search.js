import _ from 'lodash';
import { faker } from '@faker-js/faker';
import React from 'react';
import { Search, Grid, Header, Segment } from 'semantic-ui-react';

const source = _.times(5, () => ({
    title: faker.company.name(),
    description: faker.company.catchPhrase(),
    image: faker.internet.avatar(),
    price: faker.finance.amount(0, 100, 2, '$'),
}));

const initialState = {
    loading: false,
    results: [],
    value: '',
};

function SearchReducer(state, action) {
    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialState;
        case 'START_SEARCH':
            return { ...state, loading: true, value: action.query };
        case 'FINISH_SEARCH':
            return { ...state, loading: false, results: action.results };
        case 'UPDATE_SELECTION':
            return { ...state, value: action.selection };

        default:
            throw new Error();
    }
}

function SearchStandard() {
    const [state, dispatch] = React.useReducer(SearchReducer, initialState);
    const { loading, results, value } = state;

    const timeoutRef = React.useRef();
    const handleSearchChange = React.useCallback((e, data) => {
        clearTimeout(timeoutRef.current);
        dispatch({ type: 'START_SEARCH', query: data.value });

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' });
                return;
            }

            const re = new RegExp(_.escapeRegExp(data.value), 'i');
            const isMatch = (result) => re.test(result.title);

            dispatch({
                type: 'FINISH_SEARCH',
                results: _.filter(source, isMatch),
            });
        }, 300);
    }, []);
    React.useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <Grid>
            <Grid.Column width={12}>
                <Search
                    loading={loading}
                    placeholder="Search..."
                    onResultSelect={(e, data) => dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })}
                    onSearchChange={handleSearchChange}
                    results={results}
                    value={value}
                    size="small"
                />
            </Grid.Column>
        </Grid>
    );
}

export default SearchStandard;
