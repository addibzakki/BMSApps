const initialStateNews = {
    id: '',
    image: '',
    title: '',
    date: '',
    description: ''
}

const NewsReducer = (state = initialStateNews, action) => {
    switch(action.type){
        case 'GET_NEWS':
            return {
                ...state,
                id: action.item.id,
                image: action.item._embedded['wp:featuredmedia']['0'].source_url,
                title: action.item.title.rendered,
                date: action.item.date,
                description: action.item.content.rendered
            }
    }

    return state;
}

export default NewsReducer;