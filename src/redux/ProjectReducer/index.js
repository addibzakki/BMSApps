const initialStateProject = {
    id : '',
    image: '',
    warehouse_name: '',
    description: '',
    spesification: '',
    tenant: ''
}

const ProjectReducer = (state = initialStateProject, action) => {
    switch(action.type){
        case 'GET_PROJECT':
            return {
                ...state,
                id: action.item.id,
                image: action.item.img,
                warehouse_name: action.item.title+' - '+action.item.caption,
                description: action.item.description,
                spesification: action.item.spesification,
                tenant: action.item.tenant,
            }
    }

    return state;
}

export default ProjectReducer;