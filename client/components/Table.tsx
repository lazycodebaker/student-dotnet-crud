
'use client';

import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

type Student = {
    id: number,
    name: string,
    course: string,
    branch: string,
    rollNo: number,
    year: number,
};

type PopUpProps = {
    setisPopUpOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isForEdit?: boolean,
    student?: Student,
};

const PopUp: React.FC<PopUpProps> = ({ setisPopUpOpen, isForEdit, student }) => {

    const [name, setName] = useState<string>('');
    const [course, setCourse] = useState<string>('');
    const [branch, setBranch] = useState<string>('');
    const [roll, setRoll] = useState<number>(0);
    const [year, setYear] = useState<number>(0);

    const saveStudent = () => {
        const updatedStudent = { name, course, branch , rollNo: roll, year };

        if (isForEdit) {
            axios.put<Student>(`http://localhost:5028/api/student/${student?.id}`, {
                name: name || student?.name,
                course: course || student?.course,
                branch: branch || student?.branch,
                rollNo: roll || student?.rollNo,
                year: year || student?.year
            })
                .then((res) => handleSaveResponse(res));
        } else {
            axios.post<Student>('http://localhost:5028/api/student', updatedStudent)
                .then((res) => handleSaveResponse(res));
        };
    };

    const handleSaveResponse = (res: AxiosResponse<Student>) => {
        if (res.status === 200) {
            setisPopUpOpen(false);
        };
    };

    return (
        <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-lg shadow-lg p-8 m-4 text-center">

                <div className="flex items-center justify-center flex-col w-full h-full">
                    <h1 className="text-2xl font-semibold my-8">
                        {isForEdit ? 'Edit ' : 'Add '}
                        Student</h1>

                    <div className="w-96">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                            id="name" type="text" placeholder={isForEdit ? student?.name : "Name"} />
                        <input
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                            id="course" type="text" placeholder={isForEdit ? student?.course : "Course"} />
                        <input
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                            id="branch" type="text" placeholder={isForEdit ? student?.branch : "Branch"} />


                        <input
                            value={roll}
                            onChange={(e) => setRoll(parseInt(e.target.value))}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                            id="roll" type="number" placeholder={isForEdit ? student?.rollNo.toString() : "Roll No"} />
                        <input
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                            id="year" type="number" placeholder={isForEdit ? student?.year.toString() : "Year"} />

                        <div className="flex items-center justify-between">
                            <button
                                onClick={saveStudent}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button">
                                Save
                            </button>
                            <button
                                onClick={() => setisPopUpOpen(false)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const Table: React.FC = () => {

    const [student, setStudent] = useState<Student[]>([]);
    const [isPopUpOpen, setisPopUpOpen] = useState(false);
    const [isForEdit, setisForEdit] = useState(false);
    const [studentForEdit, setStudentForEdit] = useState<Student>();

    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get<Student[]>('http://localhost:5028/api/student')
            .then((res) => setStudent(res.data))
            .catch((error) => console.error('Error fetching students:', error));
    };

    const deleteStudent = (id: number) => {
        axios.delete<Student[]>(`http://localhost:5028/api/student/${id}`)
            .then((res) => {
                const newStudents = student.filter((_student) => _student.id !== id);
                setStudent(newStudents);
            })
            .catch((error) => console.error('Error deleting student:', error));
    };

    const editStudent = (student: Student) => {
        setisForEdit(true);
        setisPopUpOpen(true);
        setStudentForEdit(student);
    };

    const addStudent = () => {
        setisForEdit(false);
        setisPopUpOpen(true);
        setStudentForEdit(undefined);
    };

    const handleAddEditClose = () => {
        setisPopUpOpen(false);
        fetchStudents(); // Refresh students after closing the PopUp
    };

    const [filteredStudent, setFilteredStudent] = useState<Student[]>([]);

    useEffect(() => {
        setFilteredStudent(
            student.filter((_student) => {

                // remove those spaces in search and then check if it is empty or not 
                if (search.replace(/\s/g, '').length === 0) return true;

                return (
                    _student.name.toLowerCase().includes(search.toLowerCase()) ||
                    _student.course.toLowerCase().includes(search.toLowerCase()) ||
                    _student.branch.toLowerCase().includes(search.toLowerCase()) ||
                    _student.rollNo.toString().includes(search) ||
                    _student.year.toString().includes(search)
                );
            })
        );
    }, [search, student]);

    return (
        <section className="w-full h-full">

            {isPopUpOpen && <PopUp setisPopUpOpen={handleAddEditClose} isForEdit={isForEdit} student={studentForEdit} />}

            <div className="container mx-auto px-4 sm:px-8">
                <div className="py-8">
                    <div>
                        <h2 className="text-2xl font-semibold leading-tight">Students</h2>
                    </div>
                    <div className="my-2 flex sm:flex-row flex-col">
                        <div className="block relative">
                            <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                                    <path
                                        d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                                    </path>
                                </svg>
                            </span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
                        </div>

                        <button
                            onClick={addStudent}
                            className=" py-1 ml-2 px-4 border-2 rounded hover:text-white text-green-500 border-green-500 hover:bg-green-500">
                            Add
                        </button>
                    </div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                        <div className="inline-block min-w-full shadow rounded-lg">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Roll No
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Course
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Branch
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Year
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudent.map((student, i) =>
                                        <tr key={student.id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {student.rollNo}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="ml-3">
                                                        <p className="text-gray-900 whitespace-no-wrap">
                                                            {student.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {student.course}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {student.branch}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {student.year}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b space-x-4 border-gray-200 bg-white text-sm">
                                                <button
                                                    onClick={() => editStudent(student)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteStudent(student.id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Table;
