const {fetchTopics}= require("../models/basic-model")
const endpoints =require("../endpoints.json")


exports.getTopics = (request, response) => {
    fetchTopics().then((topics)=>{
        response.status(200).send({ topics: topics });
    }).catch((err)=>{
        console.log(err)
    })
};

exports.getEndpoints = (request, response) => {
    response.status(200).send({ endpoints: endpoints })
  };