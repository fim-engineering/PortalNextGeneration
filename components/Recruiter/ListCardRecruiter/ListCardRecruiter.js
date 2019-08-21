import React, { useState } from 'react';

const ListCardRecruiter = (props) => {
    const [isToggle, setToggle] = useState(false)

    return (
        <>
            <div className="card-list-name" onClick={() => setToggle(!isToggle)}>
                <div className="name">
                    {props.dataRecruiter.email}
                </div>
                <div className="status">
                    {props.dataRecruiter.ktpNumber !== null ? "Active" : "-"}
                </div>
                <div className="counting">
                    0 / 0
                            </div>
            </div>

            {isToggle ? (
                <div className="list-peserta-wrapper">
                    <div className="all-peserta">
                        <h2>List Semua Peserta</h2>
                        <div className="peserta-card">
                            <div className="nama">Bagus Dwi Utama</div>
                            <div className="jalur">Next Gen</div>
                            <div className="noKTP">1231312321312</div>
                        </div>
                        <div className="peserta-card">
                            <div className="nama">Bagus Dwi Utama</div>
                            <div className="jalur">Next Gen</div>
                            <div className="noKTP">1231312321312</div>
                        </div>
                        <div className="peserta-card">
                            <div className="nama">Bagus Dwi Utama</div>
                            <div className="jalur">Next Gen</div>
                            <div className="noKTP">1231312321312</div>
                        </div>
                    </div>

                    <div className="all-peserta">
                        <h2>Peserta yang ditugaskan</h2>
                        <div className="peserta-card">
                            <div className="nama">Bagus Dwi Utama</div>
                            <div className="jalur">Next Gen</div>
                            <div className="noKTP">1231312321312</div>
                        </div>
                        <div className="peserta-card">
                            <div className="nama">Bagus Dwi Utama</div>
                            <div className="jalur">Next Gen</div>
                            <div className="noKTP">1231312321312</div>
                        </div>
                        <div className="peserta-card">
                            <div className="nama">Bagus Dwi Utama</div>
                            <div className="jalur">Next Gen</div>
                            <div className="noKTP">1231312321312</div>
                        </div>
                    </div>
                </div>
            ) : null}


            <style jsx>{`
                    .add-list-recruiter-wrapper{                       
                        display:flex;
                        flex-direction:row;
                    }                     

                    .card-list-name{
                        display:felx;
                        flex-direction:row;
                        justify-content : space-between;
                        padding: 10px;
                        border: 1px solid grey;
                        margin-bottom: 5px;
                    }                  

                    .list-peserta-wrapper{
                        background: gainsboro;
                        display: flex;
                        flex-direction: row;
                        padding:10px;
                    }

                    .list-peserta-wrapper .all-peserta{
                        width:50%;
                        border:1px solid grey;
                        padding:5px;
                        background:white;
                        height:300px;
                        overflow:scroll;
                    }

                    .list-peserta-wrapper .all-peserta .peserta-card{
                        display:flex;
                        flex-direction:row;
                        justify-content:space-between;
                        border-bottom: 1px solid #f1f1f1;
                    }

                `}</style>
        </>
    )
}

export default ListCardRecruiter;