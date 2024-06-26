/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from '../../components/Sidebar'
import { useFormik } from 'formik';
import ModalLogout from '@/components/ModalLogout';
import bandApi from '@/api/modules/bands.api';
import concertApi from '@/api/modules/concerts.api';

export default function addBand() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isOnRequest, setIsOnRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [concerts, setConcerts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
        router.push('/login')
        } else if (role == "User"){
        router.push('/')
        }
        const fetchConcerts = async () => {
            try {
                const { response } = await concertApi.getAllConcerts();
                // console.log("response:", response);
                // console.log("error:", error.data);
                if (response) {
                    setConcerts(response);
                    // console.log(concerts);
                }
            } catch (error) {
                setErrorMessage('Failed to fetch concerts');
            }
        };
        fetchConcerts();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('idUser');
        router.push('/login');
        setShowModal(false);
    };

    const formik = useFormik({
        initialValues: {
            namaBand: '',
            idConcert: '',
            imageBand: ''
        },
        validate: values => {
            const errors = {};
            if (!values.namaBand) {
                errors.namaBand = 'Required';
            }
            if (!values.idConcert) {
                errors.idConcert = 'Required';
            }
            if (!values.imageBand) {
                errors.imageBand = 'Required';
            }
            return errors;
        },
        onSubmit: async (values) => {
            if (isOnRequest) return;
            setIsOnRequest(true);

            try {
                const formData = new FormData();
                formData.append('Name', values.namaBand);
                formData.append('ImageBand', values.imageBand);
                formData.append('IdConcert', values.idConcert);
                console.log(formData);
                const { response, error } = await bandApi.createBand(formData); 
                console.log("response:", response);
                console.log("error:", error);

                if (response) {
                    formik.resetForm();
                    router.push('/admin/bands');
                }
                if (error) {
                    setErrorMessage(error.message);
                }
            } catch (error) {
                console.log(error);
                setErrorMessage("Pendaftaran gagal. Silahkan coba lagi!");
            }
            setIsOnRequest(false)
        },
    });

    return (
        <div className="flex">
            <Sidebar setShowModal={setShowModal}/>
            <main className="flex-1 h-screen overflow-auto bg-gray-100 p-8 ml-[20%]">
                <h1 className="text-2xl font-bold mb-8">Form Insert Data Band</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="namaBand" className="block text-gray-700 font-bold mb-2">Nama Band</label>
                        <input
                            id="namaBand"
                            name="namaBand"
                            type="text"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={formik.handleChange}
                            value={formik.values.namaBand}
                        />
                        {formik.errors.namaBand && <div className="text-red-500 text-sm">{formik.errors.namaBand}</div>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="idConcert" className="block text-gray-700 font-bold mb-2">Nama Concert</label>
                        <select
                            id="idConcert"
                            name="idConcert"
                            onChange={formik.handleChange}
                            value={formik.values.idConcert}
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select Concert</option>
                            {concerts && (
                                concerts.map(concert => (
                                    <option key={concert.concert_id} value={concert.concert_id}>{concert.nama}</option>
                                ))
                            )}
                        </select>
                        {formik.errors.idConcert && <div className="text-red-500 text-sm">{formik.errors.idConcert}</div>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imageBand" className="block text-gray-700 font-bold mb-2">Image Band</label>
                        <input
                            id="imageBand"
                            name="imageBand"
                            type="file"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(event) => {
                                formik.setFieldValue("imageBand", event.currentTarget.files[0]);
                            }}
                        />
                        {formik.errors.imageBand && <div className="text-red-500 text-sm">{formik.errors.imageBand}</div>}
                    </div>
                    {errorMessage && <div className="mt-2 mb-2 text-sm text-red-600">{errorMessage}</div>}
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Add Band
                    </button>
                </form>
            </main>
            {/* Aktifkan modal saat showModal bernilai true */}
            {showModal && (
                <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout}/>
            )}
        </div>
    );
}
