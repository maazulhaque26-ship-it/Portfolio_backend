const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// 1. Database Connection
require('./connection/db');

// 2. Models Import
const HeroModel = require('./models/heroModel'); 
const StatsModel = require('./models/statsModel'); 
const ProjectModel = require('./models/projectModel'); 
const ServiceModel = require('./models/ServicesModel');
const ContactModel = require('./models/contactModel');

// 3. Middleware
const verifyAdmin = require('./middlewares/islogin');

// 4. CORS Setup - Fixed for Vercel + Render
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://portfolio-frontend-five-gray.vercel.app", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(cookieParser());
app.use(express.json());

// ================= AUTH ROUTES =================

// LOGIN: Added 'secure' and 'sameSite: none' for Cross-Domain Cookies
app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return res.cookie('token', token, {
            httpOnly: true, 
            secure: true,        // Required for HTTPS (Vercel/Render)
            sameSite: 'none',    // Required for Cross-site cookies
            maxAge: 86400000 
        }).json({ msg: "Login successful!" });
    }
    res.status(400).json({ msg: "Invalid Email or Password!" });
});

app.get('/admin/status', verifyAdmin, (req, res) => res.sendStatus(200));

// LOGOUT: Fixed to clear cookies properly on live site
app.post('/admin/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).json({ msg: "Logged out successfully!" });
});

// ================= HERO ROUTES =================
app.get('/gethero', async (req, res) => {
    try {
        const hero = await HeroModel.findOne();
        res.json(hero || null);
    } catch (err) { res.status(500).json(null); }
});

app.post('/admin/hero', verifyAdmin, async (req, res) => {
    try {
        const newHero = await HeroModel.create(req.body);
        res.status(201).json(newHero);
    } catch (err) { res.status(500).json({ msg: "Failed to create hero section" }); }
});

app.put('/admin/hero/:id', verifyAdmin, async (req, res) => {
    try {
        const updated = await HeroModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json({ msg: "Update failed" }); }
});

app.delete('/admin/hero/:id', verifyAdmin, async (req, res) => {
    try {
        await HeroModel.findByIdAndDelete(req.params.id);
        res.json({ msg: "Hero section deleted" });
    } catch (err) { res.status(500).json({ msg: "Delete operation failed" }); }
});

// ================= PROJECT ROUTES =================
app.get('/getprojects', async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        res.json(projects);
    } catch (err) { res.status(500).json([]); }
});

app.post('/admin/product', verifyAdmin, async (req, res) => {
    try {
        const newProject = await ProjectModel.create(req.body);
        res.status(201).json(newProject);
    } catch (err) { res.status(500).json({ msg: "Failed to add project" }); }
});

app.put('/admin/product/:id', verifyAdmin, async (req, res) => {
    try {
        const updated = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json({ msg: "Project update failed" }); }
});

app.delete('/admin/product/:id', verifyAdmin, async (req, res) => {
    try {
        await ProjectModel.findByIdAndDelete(req.params.id);
        res.json({ msg: "Project deleted successfully" });
    } catch (err) { res.status(500).json({ msg: "Delete operation failed" }); }
});

// ================= SERVICES ROUTES =================
app.get('/getservices', async (req, res) => {
    try {
        const services = await ServiceModel.find();
        res.json(services);
    } catch (err) { res.status(500).json([]); }
});

app.post('/admin/services', verifyAdmin, async (req, res) => {
    try {
        const newService = await ServiceModel.create(req.body);
        res.status(201).json(newService);
    } catch (err) { res.status(500).json({ msg: "Failed to add service" }); }
});

app.put('/admin/services/:id', verifyAdmin, async (req, res) => {
    try {
        const updated = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json({ msg: "Service update failed" }); }
});

app.delete('/admin/services/:id', verifyAdmin, async (req, res) => {
    try {
        await ServiceModel.findByIdAndDelete(req.params.id);
        res.json({ msg: "Service deleted successfully" });
    } catch (err) { res.status(500).json({ msg: "Deletion failed" }); }
});

// ================= STATS & CONTACT =================
app.get('/getstats', async (req, res) => {
    try {
        const stats = await StatsModel.findOne();
        res.json(stats || {});
    } catch (err) { res.status(500).json({}); }
});

app.post('/admin/stats', verifyAdmin, async (req, res) => {
    try {
        const newStats = await StatsModel.create(req.body);
        res.status(201).json(newStats);
    } catch (err) { res.status(500).json({ msg: "Failed to save stats" }); }
});

app.delete('/admin/stats/:id', verifyAdmin, async (req, res) => {
    try {
        await StatsModel.findByIdAndDelete(req.params.id);
        res.json({ msg: "Stats cleared successfully!" });
    } catch (err) { res.status(500).json({ msg: "Clear operation failed" }); }
});

app.get('/getcontact', async (req, res) => {
    try {
        const contact = await ContactModel.findOne();
        res.json(contact || { linkTitle: 'CONNECT WITH ME', linkUrl: '#' });
    } catch (err) { res.status(500).json({}); }
});

app.put('/admin/contact', verifyAdmin, async (req, res) => {
    try {
        const contact = await ContactModel.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(contact);
    } catch (err) { res.status(500).json({ msg: "Contact update failed" }); }
});

// 5. Server Setup
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`[Success] Server is running on port: ${PORT}`));