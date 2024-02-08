import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar";
import axios from "axios";
import Dropdown from '../components/Dropdown';

const Dashboard = () => {
    const [links, setLinks] = useState([]);
    const [url, setUrl] = useState();
    const [deleteurl, setDeleteurl] = useState();

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        console.log(date);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }

    useEffect(() => {
        axios.post("http://localhost:3000/user/me",{"token" : localStorage.getItem("token")
        }).then(res => {
            const { loggedin } =res.data;
            if(loggedin == "false"){
                window.location.href = '/signin';
            }
        })

        axios.get("http://localhost:3000/url/my/links",{
            headers: {
                Authorization: "Bearer "+ localStorage.getItem("token")
            }
        }).then(res => {
            setLinks(res.data);
        }).catch((err) => {
            console.log(err)
        })
    },[]);
  return (
    <div>
        <Navbar />
        <div className='mt-12 w-4/5 mx-auto'>
            <div className='flex justify-between'>
                <div className='w-2/3'>
                    <div className="mb-3">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <input
                        type="search"
                        value={url}
                        className="relative m-0 -mr-0.5 block min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                        placeholder="Enter a link to shorten it"
                        aria-label="Shorten"
                        aria-describedby="button-addon1"
                        onChange={e => {
                            setUrl(e.target.value);
                        }} />

                    
                        <button
                        className="relative z-[2] flex items-center rounded-r dark:bg-gray-900 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                        type="button"
                        id="button-addon1"
                        data-te-ripple-init
                        data-te-ripple-color="light" 
                        onClick={() => {
                            axios.post("http://localhost:3000/url/shorten", {
                               longUrl: url 
                            }, {
                                headers : {
                                    Authorization: "Bearer "+ localStorage.getItem("token")
                                }
                            }).then(res => {
                                console.log(res.data);
                                axios.get("http://localhost:3000/url/my/links",{
                                    headers: {
                                        Authorization: "Bearer "+ localStorage.getItem("token")
                                    }
                                }).then(res => {
                                    setLinks(res.data);
                                    setUrl("");
                                }).catch((err) => {
                                    console.log(err)
                                })
                            }).catch(err => {
                                console.log(err)
                            })
                        }}>
                        Shorten
                        </button>
                    </div>
                    </div>
                        {links.length ==0 ? (
                            <p className='text-center bg-green-200 border border-green-600 rounded'>You're ready to start creating short links!<br></br> Using the field above,
                            generate your first short url.
                        </p>
                        ): (
                            <ul className='border-t border-gray-200 pt-2'>
                        {links.map((link) => (
                            <li className='flex mt-4'>
                            <div className='w-1/2'>
                                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" ><h1 className='text-md text-orange-600 mb-2'>{link.shortUrl}</h1></a>
                                <a href={link.longUrl} target="_blank" rel="noopener noreferrer"> <p className='truncate text-sm'>{link.longUrl}</p></a>

                            </div>
                            <div className='w-32 flex justify-center items-center text-sm text-orange-600'><p className='text-center'> {link.clicks} clicks </p></div>
                            <div className='w-32 flex justify-center items-center text-sm text-gray-600'><p className='text-center'> {formatDate(parseInt(link.date))} </p></div>
                            <Dropdown deleteurl = {link.urlCode} links={links} setLinks={setLinks} />

                            </li>
                        ))}
                        
                    </ul>
                        )}
                    
                    
                
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Dashboard
