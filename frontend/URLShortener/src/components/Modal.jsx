import axios from 'axios'
import React, { useState } from 'react'

const Modal = ({ closeModal, urlCode }) => {
    const [newurl,setNewurl] = useState();
    const backendurl = "https://url-shortener-backend-iota.vercel.app/";
  return (
    <div className='absolute top-0 right-0 bg-gray-200 z-20 w-96'>
        <button onClick={closeModal} className='absolute right-5 top-2'>X</button>
      <div class="m-5">
        <label for="url" class="block mb-2 text-sm font-medium text-black">New URL</label>
        <input onChange={e => {setNewurl(e.target.value)}} type="text" id="url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter new url" required />
        <button className='bg-black text-white p-2 mt-2 rounded-sm' onClick={() => {
            axios.put(`${backendurl}/url/update/${urlCode}?newurl=${newurl}`)
            .then(res => {
                console.log(res.data);
            })
            closeModal();
        }}>Save</button>
        </div>
    </div>
  )
}

export default Modal