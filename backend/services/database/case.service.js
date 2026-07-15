import Case from '../../models/Case.js';

export const createCase = async (caseData) => {
  try {
    const newCase = await Case.create(caseData);
    return newCase.toObject();
  } catch (error) {
    throw new Error(`Failed to create case: ${error.message}`);
  }
};

export const getCaseById = async (id) => {
  try {
    const foundCase = await Case.findOne({ _id: id, isDeleted: false }).populate('uploadedBy', 'fullName email role').lean();
    if (!foundCase) throw new Error('Case not found');
    return foundCase;
  } catch (error) {
    throw new Error(`Failed to retrieve case: ${error.message}`);
  }
};

export const getCaseByCaseId = async (caseId) => {
  try {
    const foundCase = await Case.findOne({ caseId, isDeleted: false }).populate('uploadedBy', 'fullName email role').lean();
    if (!foundCase) throw new Error('Case not found');
    return foundCase;
  } catch (error) {
    throw new Error(`Failed to retrieve case: ${error.message}`);
  }
};

export const getAllCases = async (filter = {}, options = {}) => {
  try {
    const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
    const queryFilter = { ...filter, isDeleted: false };
    
    const cases = await Case.find(queryFilter)
      .populate('uploadedBy', 'fullName email role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return cases;
  } catch (error) {
    throw new Error(`Failed to retrieve cases: ${error.message}`);
  }
};

export const updateCase = async (id, updateData) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updatedCase) throw new Error('Case not found');
    return updatedCase;
  } catch (error) {
    throw new Error(`Failed to update case: ${error.message}`);
  }
};

export const deleteCase = async (id) => {
  try {
    const deletedCase = await Case.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).lean();
    if (!deletedCase) throw new Error('Case not found');
    return deletedCase;
  } catch (error) {
    throw new Error(`Failed to delete case: ${error.message}`);
  }
};

export const addCaseNote = async (id, noteText, userId) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { $push: { notes: { text: noteText, addedBy: userId } } },
      { new: true, runValidators: true }
    ).lean();
    if (!updatedCase) throw new Error('Case not found');
    return updatedCase;
  } catch (error) {
    throw new Error(`Failed to add case note: ${error.message}`);
  }
};

export const updateProcessingStatus = async (id, status) => {
  return updateCase(id, { processingStatus: status });
};

export const updateSummary = async (id, summary) => {
  return updateCase(id, { summary });
};

export const updateRecommendation = async (id, recommendation) => {
  return updateCase(id, { recommendation });
};

export const countCases = async (filter = {}) => {
  try {
    return await Case.countDocuments({ ...filter, isDeleted: false });
  } catch (error) {
    throw new Error(`Failed to count cases: ${error.message}`);
  }
};
