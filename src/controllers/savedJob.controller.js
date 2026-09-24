import SavedJob from "../models/savedJob.model.js";
import Job from "../models/job.model.js";

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can save jobs"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const existingSavedJob = await SavedJob.findOne({
      job: jobId,
      user: req.user.userId
    });

    if (existingSavedJob) {
      return res.status(409).json({
        success: false,
        message: "Job already saved"
      });
    }

    const savedJob = await SavedJob.create({
      job: jobId,
      user: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      user: req.user.userId
    })
      .populate(
        "job",
        "title company location salary jobType experience skills"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      savedJobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOne({
      job: jobId,
      user: req.user.userId
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found"
      });
    }

    await SavedJob.findByIdAndDelete(savedJob._id);

    res.status(200).json({
      success: true,
      message: "Job removed from saved jobs"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};