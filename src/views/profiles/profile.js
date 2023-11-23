import styles from './scss/minProfile.module.scss';
import classNames from 'classnames/bind';
import { Paper } from '@mui/material';
import Image from '../image/Image';
import { useState, useEffect } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
function Profile({ idCourse }) {
    const cx = classNames.bind(styles);
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState();
    const [profile, setProfile] = useState();
    useEffect(() => {
        axiosPrivate
            .get(`/api/user/teacher/course/${idCourse}`)
            .then((res) => {
                setData(res.data);
                setProfile(res.data.profileTeacher[0]);
            })
            .catch((error) => console.log(error));
    }, [idCourse]);
    console.log(data);
    //<Image id={data?.id} queryKey="ImageBgProfile" url={`/api/user/image/${data?.id}/download`} />
    return (
        <div className="w-full">
            <Paper elevation={3} className="p-5 ">
                <div className="mx-auto mt-10 mb-3 ">
                    <h1 className="text-6xl font-sans tracking-wide text-black text-center">Hello !</h1>
                </div>
                <div className="mx-auto mb-10">
                    <p className="text-xl font-sans tracking-wide text-black text-center">Tôi là giáo viên của LTP </p>
                </div>

                <div className="row">
                    <div className="col l-4 h-auto rounded-lg">
                        <Image
                            id={data?.id}
                            queryKey="ImageBgProfile"
                            url={`http://localhost:8080/api/user/image/${data?.id}/download`}
                        />
                    </div>
                    <div className="col l-4">
                        <div className="mb-3">
                            <h2 className="text-xl font-sans tracking-wide">About me </h2>
                        </div>
                        <div>
                            <p className="text-base font-sans text-black break-words">{profile?.aboutMe}</p>
                        </div>
                    </div>
                    <div className="col l-4">
                        <div className="mb-3">
                            <h2 className="text-xl font-sans tracking-wide">Details </h2>
                        </div>
                        <p className="text-lg font-sans tracking-wide text-black font-semibold mb-2">Name:</p>
                        <p className="text-base font-sans tracking-wide text-black mb-2">{data?.fullname}</p>
                        <p className="text-lg font-sans tracking-wide text-black font-semibold mb-2">Work Place:</p>
                        <p className="text-base font-sans tracking-wide text-black mb-2">{profile?.workplace}</p>
                        <p className="text-lg font-sans tracking-wide text-black font-semibold mb-2">Majors</p>
                        <p className="text-base font-sans tracking-wide text-black mb-2">{profile?.teachingSubject}</p>
                        <p className="text-lg font-sans tracking-wide text-black font-semibold mb-2">Degree</p>
                        <p className="text-base font-sans tracking-wide text-black mb-2">{profile?.degree}</p>
                        <p className="text-lg font-sans tracking-wide text-black font-semibold mb-2">Email</p>
                        <p className="text-base font-sans tracking-wide text-black mb-2">{profile?.email}</p>
                        <p className="text-lg font-sans tracking-wide text-black font-semibold mb-2">Contact</p>
                        <p className="text-base font-sans tracking-wide text-black mb-2">{profile?.contact}</p>
                    </div>
                </div>
            </Paper>
        </div>
    );
}

export default Profile;
