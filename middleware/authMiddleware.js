import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next)=>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null){
    res.send('unauthorized').sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      if(err) {
      res.sendStatus(401);
    } else {
      req.user = user;
      next();
    }
  });
}

export const authorizeStudent = (req, res, next)=>{
  if(req.user.role === 'student'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};

export const authorizeAccStatus = (req, res, next)=>{
  if (req.user.role === 'approved') {
    next();
  } else {
    res.json({
      msg: 'your account is not verified'
    });
  }
};

export const authorizeLecturer = (req, res, next)=>{
  if(req.user.role == 'lecturer'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};

export const checkHODApproval = (req, res, next)=>{
  if (req.user.hodApproval == 'approved') {
    next();
  } else {
    res.json({
      msg: 'cannot upload, your HOD has not approved your account!!!'
    })
  }
};

export const authorizeHOD = (req, res, next)=>{
  if(req.user.role == 'hod'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};

export const authorizeUploader = (req, res, next)=>{
  if(req.user.role == 'hod' || req.user.role == 'lecturer'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};

export const authorizeUser = (req, res, next)=>{
  if(req.user.role == 'hod' || req.user.role == 'lecturer' || req.user.role == 'student'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
}

export const authorizeAdmin = (req, res, next)=>{
  if(req.user.role == 'admin'){
    next();
  } else{
    res.json({msg: 'access denied'});
  };
};
