import {
    Button,
    Dropdown,
    Field,
    Input,
    makeStyles,
    Select,
    Option,
} from "@fluentui/react-components";
import { Add24Regular, Dismiss16Regular} from "@fluentui/react-icons";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import OrgPhoneNumber from "./OrgPhoneNumber";
import { MediaOutlet } from "../../models/mediaOutlet";
import { OutletAssociation } from "../../models/OutletAssociation";
import { useEffect } from "react";
import { PhoneNumber } from "../../models/PhoneNumber";
import { JobTitle } from "../../models/JobTitle";

const useStyles = makeStyles({
    addButton: {
        float: "right",
    },
    outletsSection: {
        backgroundColor: '#f9f9f9',
        border: "1px solid #ccc!important",
        borderRadius: "4px",
        padding: "8px",
        marginBottom: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "Global.Size.80",
        alignSelf: "stretch",
        '& .fui-Field': {
            width: "100%",
        },
    },
});



interface MediaOutletInputProps {
    onRemove: () => void;
    outlets: MediaOutlet[];
    onAssociationDataChange: (data: OutletAssociation) => void; 
    showValidation: boolean;
    jobTitles: JobTitle[];
    errorMessages: any;
}

const MediaOutletInput: React.FC<MediaOutletInputProps> = ({ onRemove, outlets, onAssociationDataChange, showValidation, jobTitles, errorMessages }) => {
    //  const [phoneNumbers, setPhoneNumbers] = useState<number[]>([1])
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [contactPhones, setContactPhones] = useState<(PhoneNumber)[]>([]);
   
    const [outletId, setOutletId] = useState<string>();
    const [outletName, setOutletName] = useState<string>();
    const [contactEmail, setContactEmail] = useState<string>();
    const [jobTitle, setJobTitle] = useState<string>();

    const [doesNotWorkHere, setDoesNotWorksHere] = useState<boolean>(false); 

    const validate = () => {
        const errors: string[] = [];
        if (!outletId) {
            errors.push("Media organization is required.");
        }
        if (!contactEmail) {
            errors.push("Email is required.");
        }
        if (!jobTitle) {
            errors.push("Job title is required.");
        }
        // Add more validations as needed
        return errors;
    }

    useEffect(() => {
        // Call onDataChange whenever the input changes
        onAssociationDataChange({
            contactId: undefined,
            id: undefined, //done on server
            outletId: outletId,
            contactEmail: contactEmail,
            noLongerWorksHere: doesNotWorkHere,
            phoneNumber: phoneNumber,
            contactPhones: undefined,
            lastRequestDate: undefined,
            mediaContact: undefined,
            mediaOutlet: undefined,
            jobTitle: jobTitle,
            outletName: outletName,
            isMajorMedia: undefined,
        });
    }, [outletId, contactEmail, contactPhones, phoneNumber, doesNotWorkHere, jobTitle, outletName]);

    const styles = useStyles();
    // Expose the validate method to the parent component

    const handlePhoneNumberChange = (index: number, phoneNumber: any | undefined) => {
        const updatedPhones = [...contactPhones];
        updatedPhones[index] = phoneNumber;
        setContactPhones(updatedPhones);
    };
  
    return (
        <div id="outlets-section" className={styles.outletsSection}>
            <Field label="Media organization"
                required
                validationMessage={showValidation && errorMessages && errorMessages.outlet ? errorMessages.outlet : undefined}
                validationState={showValidation && errorMessages && errorMessages.outlet ? "error" : "none"}
            >
                <Dropdown
                    onOptionSelect={(_, data) => {
                        setOutletId(data.optionValue)
                        setOutletName(data.optionText)
                    }}
                >
                    <Option value={'0'} text=''></Option>
                    {outlets.map((outlet) => (
                        <Option value={outlet.id.toString()}
                            key={outlet.id.toString()}
                        >
                            {outlet.name}
                        </Option>
                    ))}
                </Dropdown>
            </Field>
            <Field label="Job title"
                required
                validationMessage={showValidation && errorMessages && errorMessages.jobTitle ? errorMessages.jobTitle : undefined}
                validationState={showValidation && errorMessages && errorMessages.jobTitle ? "error" : "none"}
            >
                <Dropdown placeholder="" appearance="outline"
                    onOptionSelect={(_, data) => setJobTitle(data.optionText || "")}
                >
                    {/*need to map this bit from actual data, not hard coded */}
                    {jobTitles.map((jobTitle, index) => (
                        <Option key={index} value={jobTitle.id.toString()} text={jobTitle.name}>{jobTitle.name}</Option>
                    ))}
                </Dropdown>
            </Field>
            <Field label="Email"
                required
                validationMessage={showValidation && errorMessages && errorMessages.email ? errorMessages.email : undefined}
                validationState={showValidation && errorMessages && errorMessages.email ? "error" : "none"}
            >
                <Input
                    onChange={(_, data) => {
                        setContactEmail(data.value)
                    } }
                />
            </Field>

            <Field label="Phone"
                required
                validationMessage={showValidation && errorMessages && errorMessages.phone ? errorMessages.contactPhone : undefined}
                validationState={showValidation && errorMessages && errorMessages.phone ? "error" : "none"}
            >
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Dropdown
                        placeholder="Select"
                        appearance="outline"
                        style={{ flex: '0 0 30%', minWidth: 0, marginBottom: 0 }}
                    >
                        <Option value={'1'} text='Primary'>Primary</Option>
                        <Option value={'2'} text='Mobile'>Mobile</Option>
                        <Option value={'3'} text='Call-in'>Call-in</Option>
                    </Dropdown>

                    <Input
                        placeholder="+1"
                        type="text"
                        style={{ flex: '1 1 auto', minWidth: 0 }}
                        onChange={(_, data) => {
                            setPhoneNumber(data.value)
                        }}
                    />
                </div>

            </Field>
        </div>
    );

}

export default MediaOutletInput;