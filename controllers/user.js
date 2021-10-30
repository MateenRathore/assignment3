const connection = require("../database")

const indexpage = (req,res)=>{
    res.render('layout',{template: 'home', role:"0"});
};

const logout = (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
};

const dashboardpage = async(req, res)=>{
    let  sql = `SELECT Role_IDrole, userID FROM user WHERE loginID = "${req.user.id}"`;
    let Role, userID, note;
    connection.query(sql, await function(err,result){
        if(result[0].Role_IDrole == undefined){
            res.redirect("/signup");
        }else{
        Role = result[0].Role_IDrole;
        userID = result[0].userID;
        if(Role == '3' || Role == '4'){
            sql = `SELECT user.username, user.Long, user.Lat FROM user WHERE Role_IDrole = "1"`;
            connection.query(sql,  function(err,result){
                if(result[0].Long == undefined){
                    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'").render('layout',{template: 'dashboard',role:Role});
                }else{
                    let location = result;
                    sql = `SELECT note FROM pd_db.note WHERE User_IDmed ='${userID}'`;
                    connection.query(sql,  function(err,result){
                        note = result;
                        res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'").render('layout',{template: 'dashboard',role:Role, result:location, note:note});         
                    });
                }
            });
        }else{
            res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'").render('layout',{template: 'dashboard',role:Role});
        }
    }
    });
}

const signup = async(req,res)=>{
    let sql = `SELECT Role_IDrole FROM user WHERE loginID = "${req.user.id}"`;
    connection.query(sql, await function(err,result){
        if(result[0].Role_IDrole == undefined){
            return res.render('layout',{template: 'signup',});
        }else{
            res.redirect('/dashboard');
        }
    });
};

const googlelogin = (req, res) => {
    let sql = `SELECT * FROM user WHERE loginID = "${req.user.id}"`;
    connection.query(sql, function(err,results){
        if(err) throw err;
        if(results.length){
            res.redirect('/dashboard');
        }else{
            sql = `INSERT INTO user (username, loginID) VALUES ('${req.user.displayName}', '${req.user.id}')`;
            connection.query(sql, function(err, result){
                if(err) throw err;
                res.redirect("/signup");
            })
        }
    });
}

const facebooklogin = (req, res) => {
    let sql = `SELECT * FROM user WHERE loginID = "${req.user.id}"`;
    connection.query(sql, function(err,result){
        if(err) throw err;
        if(result.length){
            res.redirect('/dashboard');
        }else{
            sql = `INSERT INTO user (username, loginID) VALUES ('${req.user.displayName}', '${req.user.id}')`;
            connection.query(sql, function(err, result){
                if(err) throw err;
                res.redirect("/signup");
            })
        }
    });
};

const githublogin = (req, res) => {
    let sql = `SELECT * FROM user WHERE loginID = "${req.user.id}"`;
    connection.query(sql, function(err,results){
        if(err) throw err;
        if(results.length){
            res.redirect('/dashboard');
        }else{
            sql = `INSERT INTO user (username, loginID) VALUES ('${req.user.username}', '${req.user.id}')`;
            connection.query(sql, function(err, result){
                if(err) throw err;
                res.redirect("/signup");
            })
        }
    });
}

const signupPage = (req, res)=>{
    let roleId = parseInt(req.body.role);
    let organizationId = parseInt(req.body.organization);
    let sql = `UPDATE user SET Role_IDrole = ${roleId}, Organization = ${organizationId} WHERE loginID = "${req.user.id}";`
    connection.query(sql, function(err,results){
        if(err) throw err;
        if(results.changedRows>0){
            res.redirect('/dashboard');
        }
    });
}

const addnewcomment = (req, res)=>{
    let user;
    let sql = `SELECT user.userID FROM user WHERE loginID = '${req.user.id}'`;
    connection.query(sql, function(err,results){
        if(err) throw err;
        user = results[0].userID;
        console.log(results[0].userID);
        let newcomment = req.body.newcomment;
        sql = `INSERT INTO note (Test_Session_IDtest_session, note, User_IDmed) VALUES ("1", '${newcomment}', '${user}');`
        connection.query(sql, function(err,results){
            if(err) throw err;
            if(results.affectedRows>0){
                res.redirect('/dashboard');
            }
        });
    });

}
module.exports= {
    indexpage,
    logout,
    dashboardpage,
    signup, 
    googlelogin,
    facebooklogin,
    githublogin,
    signupPage,
    addnewcomment
}