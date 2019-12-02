const storyList = {
    1: ('NEWLINE Wynken, Blynken, and Nod one night NEWLINE Sailed off in a wooden shoe,— NEWLINESailed on a river of crystal light NEWLINE Into a sea of dew NEWLINE "Where are you going, and what do you wish?" NEWLINE The old moon asked the three, NEWLINE"We have come to fish for the herring-fish NEWLINE That live in this beautiful sea; NEWLINE Nets of silver and gold have we," NEWLINE Said Wynken, NEWLINE Blynken, NEWLINE And Nod. NEWLINE The old moon laughed and sang a song, NEWLINE As they rocked in the wooden shoe; NEWLINEAnd the wind that sped them all night long NEWLINE Ruffled the waves of dew; NEWLINEThe little stars were the herring-fish NEWLINE That lived in the beautiful sea NEWLINE"Now cast your nets wherever you wish,— NEWLINE Never afraid are we!" NEWLINE So cried the stars to the fishermen three, NEWLINE Wynken, NEWLINE Blynken, NEWLINE And Nod. NEWLINE All night long their nets they threw NEWLINE To the stars in the twinkling foam,— NEWLINEThen down from the skies came the wooden shoe, NEWLINE Bringing the fishermen home: NEWLINE\'Twas all so pretty a sail, it seemed NEWLINE As if it could not be; NEWLINEAnd some folk thought \'twas a dream they\'d dreamed NEWLINE Of sailing that beautiful sea; NEWLINE But I shall name you the fishermen three: NEWLINE Wynken, NEWLINE Blynken, NEWLINE And Nod. NEWLINE Wynken and Blynken are two little eyes, NEWLINE And Nod is a little head, NEWLINEAnd the wooden shoe that sailed the skies NEWLINE Is a wee one\'s trundle-bed; NEWLINESo shut your eyes while Mother sings NEWLINE Of wonderful sights that be, NEWLINEAnd you shall see the beautiful things NEWLINE As you rock in the misty sea NEWLINE Where the old shoe rocked the fishermen three:— NEWLINE Wynken, NEWLINE Blynken, NEWLINE And Nod.').split('. '),
    2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.split('. ')
}

const initialState = {
    currentStoryId: null,
    storiesById: {
        1: {
            title: 'Wynken, Blynken, and Nod',
            storyId: 1,
            storyArray: storyList[1],
            arrayPosition: 0
        },
        2: {
            title: 'Lorem Ipsum',
            storyId: 2,
            storyArray: storyList[2],
            arrayPosition: 0
        }
    }
};

//REDUX REDUCERS
const snippetChangeReducer = (storiesByIdStateSlice = initialState.storiesById, action) => {
    let newArrayPosition;
    let newStoriesByIdEntry;
    let newStoriesByIdStateSlice;
    switch (action.type) {
        case 'NEXT_SNIPPET':
            newArrayPosition= storiesByIdStateSlice[action.currentStoryId].arrayPosition +1;
            newStoriesByIdEntry = Object.assign({}, storiesByIdStateSlice[action.currentStoryId], { arrayPosition: newArrayPosition });
            newStoriesByIdStateSlice = Object.assign({}, storiesByIdStateSlice, { [action.currentStoryId]: newStoriesByIdEntry})
            return newStoriesByIdStateSlice;
        case 'RESTART_STORY':
            newStoriesByIdEntry = Object.assign({}, storiesByIdStateSlice[action.currentStoryId], { arrayPosition: 0 })
            newStoriesByIdStateSlice = Object.assign({}, storiesByIdStateSlice, { [action.currentStoryId]: newStoriesByIdEntry})
            return newStoriesByIdStateSlice;
        default:
            return storiesByIdStateSlice;
    }
}
const storyChangeReducer = (currentStoryIdStateSlice = initialState.currentStoryId, action) => {
    switch (action.type) {
        case 'CHANGE_STORY':
            return action.newSelectedStoryId;
        default:
            return currentStoryIdStateSlice;
    }
}
const rootReducer = this.Redux.combineReducers({
    currentStoryId: storyChangeReducer,
    storiesById: snippetChangeReducer
});

//REDUX STORE
const { createStore } = Redux;
const store = createStore(rootReducer);

//RENDERING STATE IN DOM
const renderSnippet = () => {
  const snippetDisplay = document.getElementById('story-snippet');
  while (snippetDisplay.firstChild) {
    snippetDisplay.removeChild(snippetDisplay.firstChild);
  }
  if (store.getState().currentStoryId) {
    let allStories = store.getState().storiesById;
    let storyId = store.getState().currentStoryId;
    let currentStory = allStories[storyId];
    const currentSnippet = currentStory.storyArray[currentStory.arrayPosition];
    //////////////////////////////////////////////////////////////////////////////////////////
    const lineByLine = currentSnippet.split('NEWLINE');
    for (var j = 0; j < lineByLine.length; j++) {
        const renderedLine = document.createTextNode(lineByLine[j]);
        if (j === 2  || j === 4 || j === 6 || j === 8 || j === 9) {
            document.getElementById('story-snippet').insertAdjacentHTML('beforeend', '<br/>');
            document.getElementById('story-snippet').insertAdjacentHTML('beforeend', '&emsp;');
        } else if (j === 12 || j === 10 || j === 11) {
            document.getElementById('story-snippet').insertAdjacentHTML('beforeend', '<br/>');
            document.getElementById('story-snippet').insertAdjacentHTML('beforeend', '&emsp;&emsp;');
        } else {
            document.getElementById('story-snippet').insertAdjacentHTML('beforeend', '<br/>');
        }
        document.getElementById('story-snippet').appendChild(renderedLine);
    }
    document.getElementById('story-snippet').insertAdjacentHTML('beforeend', '<br/>');
//////////////////////////////////////////////////////////////////////////////////////////
  } else {
      const selectStoryMessage = document.createTextNode('Select a story to read!');
      document.getElementById('story-snippet').appendChild(selectStoryMessage);
  }
}

const renderStories = () => {
    const storiesById = store.getState().storiesById;
    for (const storyKey in storiesById) {
        const story = storiesById[storyKey];
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const em = document.createElement('em');
        const storyTitle = document.createTextNode(story.title);
        em.appendChild(storyTitle);
        h3.appendChild(em);
        h3.addEventListener('click', function() {
            selectStory(story.storyId);
        });
        li.appendChild(h3);
        document.getElementById('stories').appendChild(li);
    }
}

window.onload = function() {
    renderStories();
    renderSnippet();
}

// CLICK LISTENERS
const selectStory = (newStoryId) => {
    let action;
    if (store.getState().currentStoryId) {
        action = {
            type: 'RESTART_SONG',
            currentStoryId: store.getState().currentStoryId
        }
    } else {
        action = {
            type: 'CHANGE_STORY',
            newSelectedStoryId: newStoryId
        }
    }
    store.dispatch(action);
}
const userClick = () => {
    let allStories = store.getState().storiesById;
    let storyId = store.getState().currentStoryId;
    let currentStory = allStories[storyId];
    if (currentStory.arrayPosition === currentStory.storyArray.length - 1) {
        store.dispatch({
            type: 'RESTART_STORY',
            currentStoryId: storyId
        });
    } else {
        store.dispatch({
            type: 'NEXT_SNIPPET',
            currentStoryId: storyId
        });
    }
}

// SUBSCRIBE TO REDUX STORE
store.subscribe(renderSnippet);

//JEST TESTS & SETUP
const { expect } = window;

expect(snippetChangeReducer(initialState.storiesById, { type: null })).toEqual(initialState.storiesById);

expect(snippetChangeReducer(initialState.storiesById, { type: 'NEXT_SNIPPET', currentStoryId: 1 })).toEqual({
    1: {
        title: 'Wynken, Blynken, and Nod',
        storyId: 1,
        storyArray: storyList[1],
        arrayPosition: 1
    },
    2: {
        title: 'Lorem Ipsum',
        storyId: 2,
        storyArray: storyList[2],
        arrayPosition: 0
    }
});

expect(snippetChangeReducer(initialState.storiedById, { type: 'RESTART_STORY', currentStoryId: 1})).toEqual({
    1: {
        title: 'Wynken, Blynken, and Nod',
        storyId: 1,
        storyArray: storyList[1],
        arrayPosition: 0
    },
    2: {
        title: 'Lorem Ipsum',
        storyId: 2,
        storyArray: storyList[2],
        arrayPosition: 0
    }
});

expect(rootReducer(initialState, { type: null })).toEqual(initialState);
expect(store.getState().currentSongId).toEqual(storyChangeReducer(undefined, { type: null}));
expect(store.getState().storiesById).toEqual(snippetChangeReducer(undefined, { type: null }));














