import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next)=>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    if(err) return res.sendStatus(401);
    req.user = user;
    next();
  })
}

export const authorizeStudent = (req, res, next)=>{
  if(req.user.role == 'student'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};

export const authorizeLecturer = (req, res, next)=>{
  if(req.user.role == 'lecturer'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};

export const authorizeHOD = (req, res, next)=>{
  if(req.user.role == 'hod'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};

export const authorizeAdmin = (req, res, next)=>{
  if(req.user.role == 'admin'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};