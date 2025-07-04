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
import type { JobTitle } from './job-title';
// May contain unused imports in some cases
// @ts-ignore
import type { MediaOutletContactRelationship } from './media-outlet-contact-relationship';
// May contain unused imports in some cases
// @ts-ignore
import type { MediaRequest } from './media-request';
// May contain unused imports in some cases
// @ts-ignore
import type { PhoneNumber } from './phone-number';
// May contain unused imports in some cases
// @ts-ignore
import type { SocialMedia } from './social-media';

/**
 * 
 * @export
 * @interface MediaContact
 */
export interface MediaContact {
    /**
     * 
     * @type {string}
     * @memberof MediaContact
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof MediaContact
     */
    'firstName': string;
    /**
     * 
     * @type {string}
     * @memberof MediaContact
     */
    'lastName': string;
    /**
     * 
     * @type {boolean}
     * @memberof MediaContact
     */
    'isPressGallery'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof MediaContact
     */
    'personalWebsite'?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof MediaContact
     */
    'isActive'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof MediaContact
     */
    'email': string;
    /**
     * 
     * @type {number}
     * @memberof MediaContact
     */
    'jobTitleId': number;
    /**
     * 
     * @type {JobTitle}
     * @memberof MediaContact
     */
    'jobTitle'?: JobTitle;
    /**
     * 
     * @type {Array<MediaOutletContactRelationship>}
     * @memberof MediaContact
     */
    'mediaOutletContactRelationships'?: Array<MediaOutletContactRelationship> | null;
    /**
     * 
     * @type {Array<MediaRequest>}
     * @memberof MediaContact
     */
    'mediaRequests'?: Array<MediaRequest> | null;
    /**
     * 
     * @type {Array<SocialMedia>}
     * @memberof MediaContact
     */
    'socialMedias'?: Array<SocialMedia> | null;
    /**
     * 
     * @type {Array<PhoneNumber>}
     * @memberof MediaContact
     */
    'phoneNumbers'?: Array<PhoneNumber> | null;
    /**
     * 
     * @type {string}
     * @memberof MediaContact
     */
    'location'?: string | null;
}

