const pdfParseModule = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * Helper to safely extract text from PDF buffer regardless of module export format.
 */
async function parsePdfBuffer(buffer) {
    const parser = pdfParseModule.default || pdfParseModule;

    try {
        // Attempt standard function call (pdf-parse v1.x)
        const data = await parser(buffer);
        return data?.text || "";
    } catch (err) {
        // If the export is an ES6 class constructor requiring 'new'
        if (err instanceof TypeError && err.message.includes("Class constructor")) {
            const instance = new parser(buffer);
            if (typeof instance.getText === "function") {
                const result = await instance.getText();
                return typeof result === "string" ? result : result?.text || "";
            }
            if (typeof instance.parse === "function") {
                const result = await instance.parse();
                return typeof result === "string" ? result : result?.text || "";
            }
            return instance.text || "";
        }
        throw err;
    }
}

/**
 * Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." });
        }

        // Extract resume text safely if a file was uploaded
        let resumeText = "";
        if (req.file) {
            resumeText = await parsePdfBuffer(req.file.buffer);
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({ 
                message: "Please provide either a resume or a self-description." 
            });
        }

        // Generate report via AI service
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        });

        // Save to MongoDB with exact key structure
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription,
            title: interViewReportByAi.title,
            matchScore: interViewReportByAi.matchScore,
            skillGaps: interViewReportByAi.skillGaps,
            technicalQuestions: interViewReportByAi.technicalQuestions,
            behavioralQuestions: interViewReportByAi.behavioralQuestions,
            preparationPlan: interViewReportByAi.preparationPlan
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Error in generateInterViewReportController:", error);

    if (error?.status === 429 || error?.message?.includes("429")) {
        return res.status(429).json({
            message: "Gemini API rate limit reached. Please wait 15–30 seconds before clicking generate again."
        });
    }

    return res.status(500).json({ 
        message: "Failed to generate report", 
        error: error.message 
    });
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching report", error: error.message });
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching reports", error: error.message });
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);
    } catch (error) {
        return res.status(500).json({ message: "Error generating PDF", error: error.message });
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
};