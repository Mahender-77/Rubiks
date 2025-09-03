import Jobs from "../models/Jobs.js";
export const getJobs = async (req, res, next) => {
    try {
        const jobs = await Jobs.find().sort({ createdAt: -1 });
        res.json({ success: true, jobs });
    }
    catch (error) {
        console.error("Get jobs error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getJobFilters = async (req, res) => {
    try {
        const jobs = await Jobs.find({}, {
            type: 1,
            experience: 1,
            location: 1,
            company: 1,
            skills: 1,
            "salary.min": 1,
            "salary.max": 1,
        });
        const filterOptions = {
            jobTypes: [],
            experienceLevels: [],
            locations: [],
            companies: [],
            skills: [],
            salaryRange: { min: 0, max: 200000 },
        };
        let minSalary = Infinity;
        let maxSalary = 0;
        jobs.forEach((job) => {
            // Job types
            if (job.type && !filterOptions.jobTypes.includes(job.type)) {
                filterOptions.jobTypes.push(job.type);
            }
            // Experience levels
            if (job.experience &&
                !filterOptions.experienceLevels.includes(job.experience)) {
                filterOptions.experienceLevels.push(job.experience);
            }
            // Locations
            if (job.location && !filterOptions.locations.includes(job.location)) {
                filterOptions.locations.push(job.location);
            }
            // Companies
            if (job.company && !filterOptions.companies.includes(job.company)) {
                filterOptions.companies.push(job.company);
            }
            // Skills
            if (job.skills && Array.isArray(job.skills)) {
                job.skills.forEach((skill) => {
                    if (skill && !filterOptions.skills.includes(skill)) {
                        filterOptions.skills.push(skill);
                    }
                });
            }
            // Salary range
            if (job.salary) {
                if (job.salary.min && job.salary.min < minSalary) {
                    minSalary = job.salary.min;
                }
                if (job.salary.max && job.salary.max > maxSalary) {
                    maxSalary = job.salary.max;
                }
            }
        });
        // Salary range
        filterOptions.salaryRange.min = minSalary === Infinity ? 0 : minSalary;
        filterOptions.salaryRange.max = maxSalary === 0 ? 200000 : maxSalary;
        // Default values if empty
        if (filterOptions.jobTypes.length === 0) {
            filterOptions.jobTypes = [
                "full-time",
                "part-time",
                "contract",
                "internship",
            ];
        }
        if (filterOptions.experienceLevels.length === 0) {
            filterOptions.experienceLevels = ["entry", "mid", "senior", "lead"];
        }
        if (filterOptions.locations.length === 0) {
            filterOptions.locations = ["Remote"];
        }
        // Sort
        filterOptions.jobTypes.sort();
        filterOptions.experienceLevels.sort((a, b) => {
            const order = ["entry", "mid", "senior", "lead"];
            return order.indexOf(a) - order.indexOf(b);
        });
        filterOptions.locations.sort();
        filterOptions.companies.sort();
        filterOptions.skills.sort();
        res.status(200).json({
            success: true,
            message: "Filter options retrieved successfully",
            filterOptions,
        });
    }
    catch (error) {
        console.error("Get job filters error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve filter options",
            error: error.message,
        });
    }
};
export const fetchJobsAPI = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;
        // Sorting
        const sortBy = req.query.sortBy || "postedDate";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        // Filters
        const filters = {};
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, "i");
            filters.$or = [
                { title: searchRegex },
                { company: searchRegex },
                { location: searchRegex },
                { skills: searchRegex },
            ];
        }
        if (req.query.jobTypes) {
            filters.type = { $in: req.query.jobTypes.split(",") };
        }
        if (req.query.experienceLevels) {
            filters.experience = {
                $in: req.query.experienceLevels.split(","),
            };
        }
        if (req.query.locations) {
            filters.location = { $in: req.query.locations.split(",") };
        }
        if (req.query.minSalary || req.query.maxSalary) {
            filters["salary.min"] = {
                $gte: parseInt(req.query.minSalary) || 0,
            };
            filters["salary.max"] = {
                $lte: parseInt(req.query.maxSalary) || 200000,
            };
        }
        // Query DB
        const total = await Jobs.countDocuments(filters);
        const jobs = await Jobs.find(filters)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            success: true,
            message: "Jobs retrieved successfully",
            jobs,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
            },
        });
    }
    catch (error) {
        console.error("Get jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve jobs",
            error: error.message,
        });
    }
};
