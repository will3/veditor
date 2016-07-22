module.exports = {
	Critter: require('./critter'),
	Frame: require('./frame'),
	Layer: require('./layer')
};

/**
 * Interface for editable models
 * 
 * @interface Editable
 */

/**
 * @property {THREE.Object3D} Editable#object object of the model
 */

/**
 * Update mesh of model
 * @function
 * @param {THREE.Material} blockMaterial material used to mesh
 * @name Editable#updateMesh
 */

/**
 * Get chunks, or relevant chunks to edit
 * @function
 * @name Editable#getChunks
 */

/**
 * Get history, or relevant history for undo / redo
 * @function
 * @name Editable#getHistory
 */

/**
 * Serialize into JSON
 * @function
 * @name Editable#serialize
 * @return {JSON} serialized JSON
 */

/**
 * Deserialize data
 * @function
 * @param {JSON} data data to deserialize
 */

/**
 * Clear all data
 * @function
 * @name Editable#clear
 */

/**
 * Get frames optional
 * @function
 */