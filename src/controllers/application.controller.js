import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can apply for jobs"
      });
    }

    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const existingApplication =
      await Application.findOne({
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
      coverLetter: coverLetter || ""
    });

    const populatedApplication =
      await Application.findById(application._id)
        .populate(
          "job",
          "title company location salary jobType experience skills"
        )
        .populate(
          "applicant",
          "name email phone resume"
        );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: populatedApplication
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
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can access applications"
      });
    }

    const applications = await Application.find({
      applicant: req.user.userId
    })
      .populate(
        "job",
        "title company location salary jobType experience skills"
      )
      .sort({
        createdAt: -1
      });

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
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access applicants"
      });
    }

    const job = await Job.findById(req.params.jobId);

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
        message: "You are not allowed to view these applications"
      });
    }

    const applications =
      await Application.find({
        job: req.params.jobId
      })
        .populate(
          "applicant",
          "name email phone resume skills"
        )
        .populate(
          "job",
          "title company location"
        )
        .sort({
          createdAt: -1
        });

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

export const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update application status"
      });
    }

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

    const application =
      await Application.findById(
        req.params.id
      ).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (
      application.job.recruiter.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this application"
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