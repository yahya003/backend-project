const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

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



exports.fetchArticles = (sort_by, order, topic) => {
  let queryStr = ''
  
  if (sort_by == undefined) {
    sort_by = 'created_at'
  }
  if (order == undefined) {
    order = 'DESC'
  }
  if (topic != undefined) {
    queryStr= `WHERE topic = '${topic}'` 
  } 

  if (!['votes', 'created_at','author','article_id', 'comment_count'].includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort query' });
  }
  if (!['ASC', 'DESC'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }
    if (!['mitch', 'cats', 'paper', undefined].includes(topic)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  return db
    .query(`
    SELECT DISTINCT articles.*, COUNT (comments.comment_id) ::INT AS comment_count 
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    ${queryStr}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`)
      .then(({ rows }) => {
        if (rows.length == 0) {
          return Promise.reject({status: 404, msg: "This article does not exist"})
        }
        
        else {
          return rows
        }  
      }) 
  };



exports.fetchArticleByID = (article_id) => {  
  if ((!(article_id)) || isNaN(article_id) == true) {
    return Promise.reject({status: 400, msg: "Bad Request"})
  }

  const checkArticleExists = checkExists('articles','article_id', article_id)
  return checkArticleExists
  .then(() => {
    return db
    .query(`
    SELECT articles.*, COUNT (comments.comment_id) AS comment_count 
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
  })
      .then(({ rows }) => {
        return rows[0]  
      }) 
};



exports.fetchCommentsFromArticleByID = (article_id) => {
  if ((!(article_id)) || isNaN(article_id) == true) {
    return Promise.reject({status: 400, msg: "Bad Request"})
  }

  const checkArticleExists = checkExists('articles','article_id', article_id)
  return checkArticleExists
    .then(() => {
      return db.query(
        `SELECT comments.comment_id, comments.body, comments.author, comments.created_at, comments.votes
        FROM comments
        JOIN articles
        ON comments.article_id = articles.article_id
        WHERE comments.article_id = $1
        ORDER BY created_at DESC`, [article_id])
    })
  .then(({rows}) => {
    return rows
  })
}

    
  
  

exports.fetchAndPatchArticleByID = (article_id, inc_votes) => {
  if ((!(article_id && inc_votes)) || isNaN(article_id || inc_votes) == true) {
    return Promise.reject({status: 400, msg: "Bad Request"})
  }
  
  const checkArticleExists = checkExists('articles','article_id', article_id)
  return checkArticleExists
  .then(() =>{
  return db
    .query(`
       UPDATE articles 
       SET votes = votes + $2
       WHERE article_id = $1 RETURNING *;`,
      [article_id, inc_votes]
    )
      .then(({ rows }) => {
        return rows[0]  
      })
    })
  }  




exports.addCommentByArticleID = (article_id, username, body) => {
  if ((!(article_id && username && body)) || isNaN(article_id) == true) {
    return Promise.reject({status: 400, msg: "Bad Request"})
  }

  const checkArticleExists = checkExists('articles','article_id', article_id)
  return checkArticleExists
  .then(() => {
  return db
    .query(
      `INSERT INTO comments (article_id, author , body)
      VALUES($1,$2,$3) RETURNING*;` , [article_id, username, body]
    )
      .then(({rows} ) => {
        return rows[0]  
      }) 
    })
};



exports.fetchAndDeleteCommentByID = (comment_id) => {
  if ((!(comment_id)) || isNaN(comment_id) == true) {
    return Promise.reject({status: 400, msg: "Bad Request"})
  }

  const checkCommentExists = checkExists('comments','comment_id', comment_id)
  return checkCommentExists

    .then(() => {
      return db.query(
        `DELETE FROM comments 
        WHERE comment_id = $1`, [comment_id])
      })
  .then(({rows}) => {
    return rows
  })
}