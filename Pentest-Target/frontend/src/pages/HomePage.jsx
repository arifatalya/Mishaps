import React, { useEffect } from 'react';
import '../styles/HomePage.css';
import Navbar from "../components/Navbar.jsx";
import ChiikawaAboutUs from '../assets/chiikawa_aboutus.jpg';
import Odi from '../assets/odi.jpg';
import Nakita from '../assets/nakita.jpg';
import Payul from '../assets/payul.jpg';
import Incik from '../assets/incik.jpg';
import BannerImage from '../assets/banner.jpg';
import Tiga from '../assets/tiga.png';
import Empat from '../assets/empat.png';
import Satu from '../assets/satu.jpg';

const activities = [
    {
        id: 1,
        title: "The Fellowship of the Cables: Adventures in Netweaverie",
        image: Satu,
        description: "Embarketh upon a noble journey to uncover the arcane arts of connecting devices yond lie far apart, crafting magical pathways through which messages flow. Prithee, learneth the secrets of protocols and routers, and joineth the Fellowship of the Eternal Ping."
    },
    {
        id: 2,
        title: "The Sorcerer’s Guide to Befriending Objects (and Bossing Them Around)",
        image: Satu,
        description: "Thou shalt discover the spells and incantations that bind objects to thy will. With methods as thy wand and inheritance as thy grimoire, thou shalt craft a realm where code obeyeth thy every whim, yet humbly doth complain when errors abound."
    },
    {
        id: 3,
        title: "The Scroll of Hallowed Entitieþs: Bondes, Keyes, and Gentle Bewilderment",
        image: Satu,
        description: "Wend thy way through the mystick realm of data, where entitieþs and bondes form the tapestry of knowledgè. Let the Entitie Relationship Diagram (ER Diagram) be thy guide, mapping attributes and keyes with care, lest thou awaken Redundancye or Inconsystencye. Master it, and the treasures of order and clarity shall be thine."
    },
    {
        id: 4,
        title: "How to Buildeth a Mesh and Rule It Like a Tyrant",
        image: Satu,
        description: "Learneth the ways of constructing mighty networks, ruling over them with an iron hand (or at least a stable IP address). Master the dark arts of bandwidth allocation and the subtle diplomacy of packet switching. Thou art destined to be the Warden of the Wires!"
    },
    {
        id: 5,
        title: "Shield Thy Network! A Knight’s Guide to Smoting Hackeths",
        image: Satu,
        description: "Don thy digital armor and prepare to face the malefactors who seek to breach thy sacred firewalls. Learneth to wield the sword of encryption and the shield of authentication to protect thy realm from vile cyber invaders."
    }
];

const testimonials = [
    {
        id: 1,
        name: "Odi",
        image: Odi,
        comment: "DTKom has significantly improved my understanding of computer technologies!"
    },
    {
        id: 2,
        name: "Naki",
        image: Nakita,
        comment: "Kalau dilihat dari segi efisiensi, sebenarnya bisa dibuat dalam 1 stream aja, dengan bahasa disesuaikan dengan bahasa si penanya. Tapi kalau Anya memang enjoy atau memang sudah punya ide mengemas sesi Q&A supaya lebih menyenangkan lagi, maka dibuat terpisah bisa jadi lebih bagus."
    },
    {
        id: 3,
        name: "Payul",
        image: Payul,
        comment: "Saya ingin bertanya perihal case study praktikum OOP tadi bang, karena saya diberi note yang mengimplikasikan bahwa saya membuat kesalahan pada Class Invoice di constructor Invoice yang kedua. Jawaban yang tepat untuk reference variable buyerId dan renterId itu bagaimana ya bang?"
    },
    {
        id: 4,
        name: "Tikus",
        image: Empat,
        comment: "Jikalau lah saya lebih teliti, berhati-hati, dan lebih memberikan rasa rispek (risih pepek) dalam memilih kegiatan studi selama 4 tahun kedepan saya, mungkin saya tidak akan terjebak di dalam tahanan ini, yang dibuat berorientasi objek. Salah satunya cara yang dapat melepaskan saya dari dunia siber (siput berak) ini adalah dengan log out dari dunia."
    },
    {
        id: 5,
        name: "Incik",
        image: Incik,
        comment: "Its all fun and enjoyable, until chat gpt became the lecturer"
    }
];

const HomePage = () => {
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector("header");
            header.classList.toggle("sticky", window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div>
            <Navbar />
            {/* Banner Section */}
            <section className="banner" style={{ backgroundImage: `url(${BannerImage})` }}>
                <div className="content">
                    <h3>Departemen Teknik Komputer (DTKom)</h3>
                    <p>Where resourcefulness meets innovation, and challenges are just opportunities in disguise.</p>
                    <a href="#komun" className="btn">Our Activities</a>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="about">
                <div className="row">
                    <div className="col50">
                        <h2 className="title-text">About Us</h2>
                        <p>
                            The Departemen Teknik Komputer (DTKom) at Fakultas Teknik [Redacted] is a focused and innovative academic community offering a single major: Teknik Komputer. Despite its specialized scope, DTKom covers a diverse range of topics, from embedded digital systems and object-oriented programming to computer networks and another emerging technologies. With a curriculum designed to blend theory and practice, and a strong emphasis on adaptability and resourcefulness, DTKom empowers students to tackle modern technological challenges. This singular focus allows DTKom to foster a tight-knit community of learners and innovators, making a significant impact in the world of computer engineering, despite being overseen most of the time.
                        </p>
                    </div>
                    <div className="col50">
                        <div className="imgbox">
                            <img src={ChiikawaAboutUs} alt="About Us" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Activities Section */}
            <section id="komun" className="class">
                <div className="title-class">
                    <h2>Our Activities</h2>
                    <p>Discover our events and programs designed to help you succeed!</p>
                </div>
                <div className="content">
                    {activities.map((activity) => (
                        <div className="box" key={activity.id}>
                            <div className="imgbox">
                                <img src={activity.image} alt={activity.title} />
                            </div>
                            <div className="text">
                                <h3>{activity.title}</h3>
                                <p>{activity.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testi" id="testimonials">
                <div className="title">
                    <h2 className="title-text">Their Comments</h2>
                    <p>Hear from our members about their experiences! :D</p>
                </div>
                <div className="content">
                    {testimonials.map((testi) => (
                        <div className="box" key={testi.id}>
                            <div className="imgbox">
                                <img src={testi.image} alt={testi.name} />
                            </div>
                            <div className="text">
                                <h3>{testi.name}</h3>
                                <p>`{testi.comment}`</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Section */}
            <footer>
                <div className="copyright">
                    <p>
                        Copyright ©2069
                        <a href="https://www.netacad.com"> Ikatan Mahasiswa Teknik Komputer (IMTKom)</a>. All Rights Reserved
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;