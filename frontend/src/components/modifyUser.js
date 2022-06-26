//EN COURS :

import React from 'react'

function modifyUser() {
  return (
    <div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="First Name" name="first_name">
        </input>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="Last Name" name="last_name">
        </input>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="email@email.com" name="email">
        </input>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="password" name="password">
        </input>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="adress" name="adress">
        </input>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="phone number" name="phone_number">
        </input>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="status" name="status">
        </input>
        </div>
    </div>
    
    <div class="col-6 d-grid">
        <button class="btn btn-primary" type="submit">Submit</button>
    </div>
    </div>
  )
}

export default modifyUser