const db = require("../db/connection");

exports.fetchTopics = () => {  
  return db
    .query(
        `SELECT * FROM topics`     
        )
    .then(({ rows }) => {
        if (rows.length == 0) {
            return Promise.reject({status: 404, msg: "This article does not exist"})
         }
         else { 
      return rows;
         }
    })
    
};

exports.fetchArticleByID = (article_id) => {  
    return db
    .query(
      `SELECT articles.*
       FROM articles
       JOIN comments ON comments.article_id = articles.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id`, [article_id]
    )
      .then(({ rows }) => {
        if (rows.length == 0) {
           return Promise.reject({status: 404, msg: "This article does not exist"})
        }
        else {
        return rows[0];
        }  
    })
      
  };


  exports.fetchUsers = () => {  
    return db
      .query(
          `SELECT * FROM users`     
          )
      .then(({ rows }) => {
        if (rows.length == 0) {
            return Promise.reject({status: 404, msg: "This article does not exist"})
         }
        else { 
        return rows;
        }  
    })
      
  };

  exports.fetchAndPatchArticleByID = (article_id) => {  
    return db
    .query(
      `SELECT articles.*
       FROM articles
       JOIN comments 
       ON comments.article_id = articles.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id`, [article_id]
    )
      .then(({ rows }) => {
        return rows[0];
      })
      
  };