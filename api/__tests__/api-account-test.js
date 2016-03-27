import supertest from 'supertest';
import {should} from 'should';

// https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/
// npm run dev  (on a separate tab, then)
// npm run test-node 
var server = supertest.agent("http://localhost:3030");

describe('Simple api account test', () => {
  it('should 404 on root route', (done) => {
    server
      .get('/')
      .end((err, res) => {
        res.status.should.equal(404);
        done();
      });
  });

  it('should be able to do a signup', (done) => {
    server
      .post('/signup')
      .send({email:'asdf@asdf.com', password: 'asdf'})
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });

  it('should be authenticated', (done) => {
    server
      .get('/me')
      .end((err, res) => {
        console.log(res.body);
        done();
      });
  });

  it('should be able to do a login', (done) => {
    server
      .post('/login')
      .send({email:'asdf@asdf.com', password: 'asdf'})
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });

});


