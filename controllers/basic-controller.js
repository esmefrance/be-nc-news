const {fetchTopics}= require("../models/basic-model")

exports.getTopics = (request, response) => {
    fetchTopics().then((topics)=>{
        response.status(200).send({ topics: topics });
    })
};
