/* tslint:disable */
/* eslint-disable */
/**
 * GCPE Media Hub 2.0 API
 * GCPE Media Hub 2.0
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import type { MediaContact } from './media-contact';

/**
 * 
 * @export
 * @interface JobTitle
 */
export interface JobTitle {
    /**
     * 
     * @type {number}
     * @memberof JobTitle
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof JobTitle
     */
    'name'?: string | null;
    /**
     * 
     * @type {Array<MediaContact>}
     * @memberof JobTitle
     */
    'mediaContacts'?: Array<MediaContact> | null;
}

