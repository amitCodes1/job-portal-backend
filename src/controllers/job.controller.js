import Job from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create jobs"
      });
    }

    const {
      title,
      description,
      company,
      location,
      salary,
      jobType,
      experience,
      skills
    } = req.body;

    if (
      !title ||
      !description ||
      !company ||
      !location ||
      !salary ||
      !jobType ||
      !experience
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required"
      });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      experience,
      skills: skills || [],
      recruiter: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "recruiter",
        "name email"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate(
        "recruiter",
        "name email"
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    if (
      job.recruiter.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this job"
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access their jobs"
      });
    }

    const jobs = await Job.find({
      recruiter: req.user.userId
    })
      .populate(
        "recruiter",
        "name email"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};