const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const projects = require('./data/helpers/projectModel.js');
const actions = require('./data/helpers/actionModel.js');

const server = express();


server.use(morgan('dev'));
server.use(helmet());
server.use(cors());
server.use(express.json());

const projectsurl = '/api/projects/';
const actionsurl = '/api/actions/';

// function upperCaser(req, res, next) {
//     req.body.name = req.body.name.toUpperCase();
//     next();

// }

/// GET 

server.get('/', (req, res) => {
    res.send(`
      <h2>Node Express Sprint Challenge</h>
      <p>I have test anxiety.</p>
    `);
  });

server.get(projectsurl, (req, res) => {
    projects.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        res.status(500).json({ error: "This information could not be retrieved." });
    })

})

// GET user by id

server.get(`${projectsurl}:id`, async(req, res) => {
    const { id } = req.params;
    try{
        const projectsData = await projects.get(id)
        if(projectsData.length === 0) {
            res.status(404).json(`{error: 'The information could not be found.'}`)
        } else {
            res.status(200).json(projectsData)
        }
    } catch(err){
        res.status(500).json(`{error: 'The information could not be found.'}`)
    }
});

server.get(`${projectsurl}actions/:projectId`, async(req, res) => {
    const { projectId } = req.params;
    try{
        const projectActions = await projects.getProjectActions(projectId)
        if(projectActions.length === 0) {
            res.status(404).json(`{error: 'Wrong ID'}`)
        } else {
            res.status(200).json(projectActions)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Something went wrong'}`)
    }
});

// POST 

server.post(`${projectsurl}`, async(req, res) => {
    const { name, description } = req.body;
    try{
        if(!name || !description){
            res.status(404).json(`{error: 'Please enter name and description'}`)
        } else if (name.length < 1) {
            res.status(404).json(`{error: 'More letters needed}`)
        } else {
            const data = await projects.insert({name, description})
            res.status(200).json(data)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Something went wrong'}`)
    }
});

// server.post(`${projectsurl}`, upperCaser, (req, res) => {
//     const newProject = req.body;
//     if (!newProject.name) {
//     res.status(400).json({ message: "Please provide title and contents for the project." });
// } else {

//     Users.insert(newProject)
//     .then(user => {
//         Users.getById(user.id)
//         .then(user => {
//             res.status(201).json({ user })
//         })
//     })
//     .catch(err => {
//         res.status(500).json({ error: "There was an error while saving the post to the database" })
//     })
// }

// });


// DELETE 

server.delete(`${projectsurl}:id`, async(req, res) => {
    const { id } = req.params;
    projects.get(id)
    try{
        const user = await projects.remove(req.params.id)
        if(user){
            res.status(204).json(user)
        } else {
            res.status(404).json(`{error: 'ID not found'}`)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Something went wrong'}`)
    }
});



// PUT 


server.put(`${projectsurl}:id`, async(req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { name, description } = req.body;
    try {
        const results = await projects.update(id, data)
        if(!name || !description) {
            res.status(404).json(`{error: 'Please enter information.'}`)
        } else if(name.length < 1) {
            res.status(404).json(`{error: 'More letters needed'}`)
        } else {
            res.status(200).json(results)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Something went wrong'}`)
    }
});


// ==================================================================================== ACTIONS


// GET

server.get(actionsurl, async(req, res) => {
    try{
        const actionsData = await actions.get()
        res.status(200).json(actionsData)
    }catch(err){
        res.status(500).json(`{error: 'Something went wrong'}`)
    }
});

server.get(`${actionsurl}:id`, async(req, res) => {
    const { id } = req.params;
    try{
        const actionsData = await actions.get(id)
        if(actionsData.length === 0) {
            res.status(404).json(`{error: 'Action not found'}`)
        } else {
            res.status(200).json(actionsData)
        }
    } catch(err){
        res.status(500).json(`{error: 'Action not found'}`)
    }
});


// POST

server.post(`${actionsurl}`, async(req, res) => {
    const { project_id, description, notes } = req.body;
    try{
        if(!project_id || !description || !notes ){
            res.status(404).json(`{error: 'Please provide more information'}`)
        } else if (description.length > 128) {
            res.status(404).json(`{error: 'More letters needed'}`)
        } else {
            const data = await actions.insert({project_id, description, notes})
            res.status(200).json(data)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Something went wrong'}`)
    }
});



// DELETE 

server.delete(`${actionsurl}:id`, async(req, res) => {
    const { id } = req.params;
    actions.get(id)
    try{
        const user = await actions.remove(req.params.id)
        if(user){
            res.status(204).json(user)
        } else {
            res.status(404).json(`{error: 'Id not found'}`)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Something went wrong'}`)
    }
});



// PUT

server.put(`${actionsurl}:id`, async(req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { project_id, description } = req.body;
    try {
        const results = await actions.update(id, data)
        if(!project_id || !description) {
            res.status(404).json(`{error: 'More info needed'}`)
        } else if(description.length > 128) {
            res.status(404).json(`{error: 'More letters needed'}`)
        } else {
            res.status(200).json(results)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Sorry something went wrong'}`)
    }
});


module.exports = server;