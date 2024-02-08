import React, { useEffect } from 'react';
import { useState} from 'react';
import axios from 'axios';
import Modal from './Modal';
const Dropdown = ({ deleteurl, links, setLinks }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const backendurl = "https://url-shortener-backend-iota.vercel.app/";

    const handleDelete = () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this link");

        if(isConfirmed){
            {
                console.log("delete clicked")
                axios.delete(`${backendurl}/url/delete/${deleteurl}`)
                .then(res => {
                    console.log(deleteurl);
                    setLinks(links.filter((link) => link.urlCode !== deleteurl))
                    toggleMenu();
                    
                })
                .catch(err => {
                    console.log(err);
                })



              }
        }
    }

    const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
     const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

  return (
    <div className="relative flex justify-center content-center">
      <div onClick= {toggleMenu} className='w-20 rounded-lg flex gap-2 justify-center items-center bg-gray-200 hover:bg-gray-400 hover:cursor-pointer'>
            <img className='w-8 h-8' src="./public/settings.svg" />
            <img className='w-6 h-6' src="/dropdown.svg" />
        </div>
      {isOpen && (
        <div className="absolute right-0 top-12 mt-2 w-28  bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={openModal}
              className="text-left w-full block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Edit
            </button>
            {isModalOpen && <Modal closeModal={closeModal} urlCode ={deleteurl} />}
            <button
              onClick={handleDelete}
              className=" text-left w-full block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
