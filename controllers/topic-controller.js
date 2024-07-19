const {fetchTopics}= require("../models/topic-model")

exports.getTopics = (request, response) => {
    fetchTopics().then((topics)=>{
        response.status(200).send({ topics: topics });
    }).catch((err)=>{
        console.log(err)
    })
};
