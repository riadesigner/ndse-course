
const records = [
    {
      id: 1,
      username: 'user',
      password: '123456',
      displayName: 'demo user',
      emails: [{ value: 'user@mail.ru' }],
    },
    {
      id: 2,
      username: 'admin',
      password: 'pass',
      displayName: 'Jill',
      emails: [{ value: 'jill@example.com' }],
    },
  ];
  
  exports.findById = function (id, cb) {
    process.nextTick(function () {
      const idx = id - 1
      if (records[idx]) {
        cb(null, records[idx])
      } else {
        cb(new Error('User ' + id + ' does not exist'))
      }
    })
  }

  exports.addNew = function (username, password, displayName, emails) {  
      return new Promise((res,rej)=>{ 
          const usr = {
            id: records.length+1,
            username: username,
            password: password,
            displayName: displayName,
            emails: [{ value: emails }]
          };
          records.push(usr);          
          res(usr);
      })    
  }  
  
  exports.findByUsername = function (username, cb) {
    process.nextTick(function () {
      let i = 0, len = records.length
      for (; i < len; i++) {
        const record = records[i]
        if (record.username === username) {
          return cb(null, record)
        }
      }
      return cb(null, null)
    })
  }
  
  exports.verifyPassword = (user, password) => {
    return user.password === password
  }