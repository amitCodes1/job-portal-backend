import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can apply for jobs"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.userId
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.userId,
      coverLetter
    });

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.userId
    })
      .populate("job", "title company location salary jobType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    if (job.recruiter.toString() !== String(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only view applications for your own jobs"
      });
    }

    const applications = await Application.find({
      job: jobId
    })
      .populate("applicant", "name email phone resume skills")
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "rejected",
      "selected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status"
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (
      application.job.recruiter.toString() !==
      String(req.user.userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update applications for your own jobs"
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

