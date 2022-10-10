const db = require("../db/connection");

exports.fetchTopics = () => {  
  return db
    .query(
        `SELECT * FROM topics`     
        )
    .then(({ rows }) => {
      return rows;
    })
    
};

exports.fetchArticleByID = (article_id) => {  
    return db
    .query(
      `SELECT articles.*
       FROM articles
       LEFT JOIN comments ON comments.article_id = articles.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id`, [article_id]
    )
      .then(({ rows }) => {
        return rows[0];
      })
      
  };


  exports.fetchUsers = () => {  
    return db
      .query(
          `SELECT * FROM users`     
          )
      .then(({ rows }) => {
        return rows;
      })
      
  };