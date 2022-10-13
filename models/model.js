const db = require("../db/connection");


exports.fetchTopics = () => {  
  return db
    .query(`SELECT * FROM topics`)
    .then(({ rows }) => {
      if (rows.length == 0) {
        return Promise.reject({status: 404, msg: "This data does not exist"})
      }
      else { return rows;}
    })
};



exports.fetchUsers = () => {  
  return db
    .query(`SELECT * FROM users`)
    .then(({ rows }) => {
      if (rows.length == 0) {
          return Promise.reject({status: 404, msg: "This data does not exist"})
      }
      else {return rows}  
    })
};



exports.fetchArticles = () => {  
  return db
    .query(`
    SELECT DISTINCT articles.*, COUNT (comments.comment_id) ::INT AS comment_count 
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`
    )
      .then(({ rows }) => {
        if (rows.length == 0) {
          return Promise.reject({status: 404, msg: "This article does not exist"})
        }
        else {return rows}  
      }) 
  };



exports.fetchArticleByID = (article_id) => {  
  return db
    .query(`
    SELECT articles.*, COUNT (comments.comment_id) AS comment_count 
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id]
    )
      .then(({ rows }) => {
        if (rows.length == 0) {
          return Promise.reject({status: 404, msg: "This article does not exist"})
        }
        else {return rows[0]}  
      }) 
};



exports.fetchCommentsFromArticleByID = (article_id) => {  
  return db
    .query(
    `SELECT comments.comment_id, comments.body, comments.author, comments.created_at, comments.votes
    FROM comments
    JOIN articles
    ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    ORDER BY created_at DESC`, [article_id]
    )
   
      .then(({ rows }) => {
        if (rows.length == 0) {
          return Promise.reject({status: 404, msg: "This article does not exist"})
        }
        else {return rows}  
      }) 
};



exports.fetchAndPatchArticleByID = (article_id, inc_votes) => {
  return db
    .query(`
       UPDATE articles 
       SET votes = votes + $2
       WHERE article_id = $1 RETURNING *;`,
      [article_id, inc_votes]
    )
      .then(({ rows }) => {
        if (rows.length == 0) {
          return Promise.reject({status: 404, msg: "This data does not exist"})
       }
      else {return rows[0]}  
    })  
};



exports.fetchAndPostCommentsByArticleID = (article_id, username, body) => {
  if (!(article_id && username && body)) {
    return Promise.reject({status: 400, msg: "Bad Request"})
  }

  return db
    .query(
      `INSERT INTO comments (article_id, author , body)
      VALUES($1,$2,$3) RETURNING*;` , [article_id, username, body]
    )
      .then(({rows} ) => {
        if (rows.length == 0) {
          return Promise.reject({status: 404, msg: "This article does not exist"})
        }
        else {return rows[0]}  
      }) 
};