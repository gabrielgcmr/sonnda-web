export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** API metadata */
        get: operations["getApiMetadata"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/docs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** API docs (Redoc) */
        get: operations["getApiDocs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/healthz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health check */
        get: operations["getHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/readyz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Readiness check */
        get: operations["getReadiness"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/exam-documents/{documentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obter documento de exame */
        get: operations["getExamDocument"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/lab-reports/{labReportId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obter laudo laboratorial */
        get: operations["getLabReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obter perfil do usuário atual
         * @description Retorna 403 com code PROFILE_NOT_FOUND quando a identidade está autenticada mas não possui cadastro local.
         */
        get: operations["getCurrentAccount"];
        /** Atualizar perfil do usuário atual */
        put: operations["updateCurrentAccount"];
        /**
         * Criar usuário
         * @description Cria o usuário da plataforma a partir da identidade autenticada (JWT do Supabase).
         *     Requer token válido do Supabase (Bearer).
         *     O servidor define account_type como basic_care.
         */
        post: operations["createCurrentAccount"];
        /** Remover usuário atual (hard delete) */
        delete: operations["deleteCurrentAccount"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/me/patients": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listar pacientes acessíveis pela conta atual */
        get: operations["listAccessiblePatients"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/patients": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listar pacientes */
        get: operations["listPatients"];
        put?: never;
        /** Criar paciente */
        post: operations["createPatient"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/patients/{patientId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obter paciente */
        get: operations["getPatient"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/patients/{patientId}/exam-documents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enviar documento de exame */
        post: operations["uploadExamDocument"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/patients/{patientId}/lab-reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listar laudos laboratoriais */
        get: operations["listPatientLabReports"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/patients/{patientId}/labs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listar laudos */
        get: operations["listPatientLabs"];
        put?: never;
        /** Upload de laudo */
        post: operations["uploadPatientLab"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AccessiblePatientSummary: {
            avatar_url?: string | null;
            full_name: string;
            /** Format: uuid */
            id: string;
        };
        AccessiblePatientsResponse: {
            limit: number;
            offset: number;
            patients: components["schemas"]["AccessiblePatientSummary"][];
            /** Format: int64 */
            total: number;
        };
        CreatePatientRequest: {
            /** Format: uri */
            avatar_url?: string | null;
            /** Format: date */
            birth_date: string;
            cns?: string | null;
            /** @description CPF sem pontuação (apenas dígitos) */
            cpf: string;
            full_name: string;
            /** @enum {string} */
            gender: "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
            phone?: string | null;
            /** @enum {string} */
            race: "WHITE" | "BLACK" | "ASIAN" | "MIXED" | "INDIGENOUS" | "UNKNOWN";
            relation_type: components["schemas"]["RelationshipType"];
        };
        /** @description Dados editáveis do cadastro. Identidade e email vêm da autenticação; o servidor define account_type como basic_care. */
        CreateUserRequest: {
            /** Format: date */
            birth_date: string;
            /** @description CPF sem pontuação (apenas dígitos) */
            cpf: string;
            full_name: string;
            phone: string;
        };
        ExamDocument: {
            /** Format: double */
            confidence?: number | null;
            /** Format: date-time */
            created_at: string;
            error_message?: string | null;
            exam_type?: string | null;
            extraction_method?: string | null;
            /** Format: uuid */
            id: string;
            mime_type: string;
            original_filename: string;
            /** Format: uuid */
            patient_id: string;
            status: string;
            storage_uri: string;
            /** Format: date-time */
            updated_at: string;
            /** Format: uuid */
            uploaded_by_user_id: string;
        };
        HealthResponse: {
            /** @example ok */
            status: string;
        };
        LabReportFull: {
            /** Format: date-time */
            created_at: string;
            fingerprint?: string | null;
            /** Format: uuid */
            id: string;
            insurance_provider?: string | null;
            lab_name?: string | null;
            lab_phone?: string | null;
            /** Format: date-time */
            patient_dob?: string | null;
            /** Format: uuid */
            patient_id: string;
            patient_name?: string | null;
            /** Format: date-time */
            report_date?: string | null;
            requesting_doctor?: string | null;
            technical_manager?: string | null;
            test_results: components["schemas"]["LabTestResultFull"][] | null;
            /** Format: date-time */
            updated_at: string;
            /** Format: uuid */
            uploaded_by_user_id: string;
        };
        LabReportFullList: components["schemas"]["LabReportFull"][];
        LabReportSummary: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            patient_id: string;
            /** Format: date-time */
            report_date?: string | null;
            summary_tests: components["schemas"]["LabResultSummary"][] | null;
        };
        LabReportSummaryList: components["schemas"]["LabReportSummary"][];
        LabResultItemSummary: {
            parameter_name: string;
            result_unit?: string | null;
            result_value?: string | null;
        };
        LabResultSummary: {
            /** Format: date-time */
            collected_at?: string | null;
            key_results: components["schemas"]["LabResultItemSummary"][] | null;
            test_name: string;
        };
        LabTestItemFull: {
            /** Format: uuid */
            id: string;
            parameter_name: string;
            reference_text?: string | null;
            result_unit?: string | null;
            result_value?: string | null;
        };
        LabTestResultFull: {
            /** Format: date-time */
            collected_at?: string | null;
            /** Format: uuid */
            id: string;
            items: components["schemas"]["LabTestItemFull"][] | null;
            material?: string | null;
            method?: string | null;
            /** Format: date-time */
            release_at?: string | null;
            test_name: string;
        };
        /** @description Retorno do processamento do laudo. */
        LabUploadResponse: {
            [key: string]: unknown;
        };
        /**
         * @description Lista de laudos. Por padrao retorna a representacao resumida
         *     (LabReportSummaryList). Quando expand=full ou include contem full,
         *     results ou test_results, retorna LabReportFullList.
         */
        LabsList: components["schemas"]["LabReportSummaryList"] | components["schemas"]["LabReportFullList"];
        /** @description Representação do paciente retornada pela API. */
        Patient: {
            avatar_url: string;
            /** Format: date-time */
            birth_date: string;
            cns?: string;
            cpf: string;
            /** Format: date-time */
            created_at: string;
            full_name: string;
            /** @enum {string} */
            gender: "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            owner_user_id?: string;
            phone?: string;
            /** @enum {string} */
            race: "WHITE" | "BLACK" | "ASIAN" | "MIXED" | "INDIGENOUS" | "UNKNOWN";
            /** Format: date-time */
            updated_at: string;
        };
        PatientCreatedResponse: {
            /** Format: uuid */
            id: string;
        };
        PatientsList: components["schemas"]["Patient"][];
        ProblemDetails: {
            /**
             * @description Código estável do erro (contrato Sonnda).
             * @example VALIDATION_FAILED
             */
            code: string;
            /**
             * @description Explicação específica desta ocorrência.
             * @example entrada inválida
             */
            detail: string;
            /**
             * @description URI que identifica a ocorrência específica do problema.
             * @example urn:sonnda:request-id:8a0f8a9b-2e1c-4c46-a2b1-1a6f8a6c2e44
             */
            instance?: string;
            /**
             * @description HTTP status code.
             * @example 400
             */
            status: number;
            /**
             * Format: date-time
             * @description Timestamp (UTC) da ocorrência do erro.
             * @example 2026-02-06T12:34:56Z
             */
            timestamp?: string;
            /**
             * @description Resumo curto e legível do problema.
             * @example Falha de validação
             */
            title: string;
            /**
             * @description Identificador para rastreamento (normalmente X-Request-ID).
             * @example 8a0f8a9b-2e1c-4c46-a2b1-1a6f8a6c2e44
             */
            traceId?: string;
            /**
             * @description URI que identifica o tipo do problema.
             * @example urn:sonnda:problem:validation_failed
             */
            type: string;
            /** @description Lista de violações de validação (quando aplicável). */
            violations?: {
                /** @example birth_date */
                field?: string;
                /** @example required */
                reason?: string;
            }[];
        };
        /**
         * @description Relação da conta que recebe acesso com o paciente.
         * @enum {string}
         */
        RelationshipType: "caregiver" | "family" | "professional" | "self";
        RootResponse: {
            docs: string;
            environment: string;
            health: string;
            name: string;
            openapi: string;
            ready: string;
            version: string;
        };
        /** @description Atualização parcial do perfil. Campos omitidos ou null são preservados. */
        UpdateUserRequest: {
            /** Format: date */
            birth_date?: string | null;
            /** @description CPF sem pontuação (apenas dígitos) */
            cpf?: string | null;
            full_name?: string | null;
            phone?: string | null;
        };
        /** @description Perfil da conta baseado em public.users. deleted_at é interno e não faz parte da resposta. */
        User: {
            /**
             * @description Valor armazenado da conta. Novos cadastros recebem basic_care; não define permissões.
             * @example basic_care
             */
            account_type: string;
            auth_issuer: string;
            auth_subject: string;
            /** Format: date */
            birth_date: string;
            cpf: string;
            /** Format: date-time */
            created_at: string;
            email: string;
            full_name: string;
            /** Format: uuid */
            id: string;
            phone: string;
            /** Format: date-time */
            updated_at: string;
        };
    };
    responses: {
        Problem: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
        /** @description Erro padronizado (RFC 9457 - Problem Details) */
        openapi_components_responses_Problem: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["ProblemDetails"];
            };
        };
    };
    parameters: {
        /** @description Número máximo de itens */
        LimitParam: number;
        /** @description Número de itens para pular */
        OffsetParam: number;
        /** @description Identificador do paciente */
        PatientId: string;
        /** @description Número máximo de itens */
        openapi_components_parameters_LimitParam: number;
        /** @description Número de itens para pular */
        openapi_components_parameters_OffsetParam: number;
        /** @description Identificador do paciente */
        openapi_components_parameters_PatientId: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getApiMetadata: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RootResponse"];
                };
            };
        };
    };
    getApiDocs: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description HTML */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/html": string;
                };
            };
        };
    };
    getHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    getReadiness: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    getExamDocument: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                documentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Documento de exame */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExamDocument"];
                };
            };
            401: components["responses"]["Problem"];
            403: components["responses"]["Problem"];
            404: components["responses"]["Problem"];
            500: components["responses"]["Problem"];
        };
    };
    getLabReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                labReportId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Laudo laboratorial */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LabReportFull"];
                };
            };
            401: components["responses"]["Problem"];
            403: components["responses"]["Problem"];
            404: components["responses"]["Problem"];
            500: components["responses"]["Problem"];
        };
    };
    getCurrentAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            401: components["responses"]["openapi_components_responses_Problem"];
            403: components["responses"]["openapi_components_responses_Problem"];
            500: components["responses"]["openapi_components_responses_Problem"];
        };
    };
    updateCurrentAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            400: components["responses"]["openapi_components_responses_Problem"];
            401: components["responses"]["openapi_components_responses_Problem"];
            403: components["responses"]["openapi_components_responses_Problem"];
            422: components["responses"]["openapi_components_responses_Problem"];
            500: components["responses"]["openapi_components_responses_Problem"];
        };
    };
    createCurrentAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUserRequest"];
            };
        };
        responses: {
            /** @description Usuário criado */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            400: components["responses"]["openapi_components_responses_Problem"];
            401: components["responses"]["openapi_components_responses_Problem"];
            409: components["responses"]["openapi_components_responses_Problem"];
            422: components["responses"]["openapi_components_responses_Problem"];
            500: components["responses"]["openapi_components_responses_Problem"];
        };
    };
    deleteCurrentAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["openapi_components_responses_Problem"];
            403: components["responses"]["openapi_components_responses_Problem"];
            500: components["responses"]["openapi_components_responses_Problem"];
        };
    };
    listAccessiblePatients: {
        parameters: {
            query?: {
                /** @description Número máximo de itens */
                limit?: components["parameters"]["openapi_components_parameters_LimitParam"];
                /** @description Número de itens para pular */
                offset?: components["parameters"]["openapi_components_parameters_OffsetParam"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccessiblePatientsResponse"];
                };
            };
            401: components["responses"]["openapi_components_responses_Problem"];
            403: components["responses"]["openapi_components_responses_Problem"];
            500: components["responses"]["openapi_components_responses_Problem"];
        };
    };
    listPatients: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PatientsList"];
                };
            };
            401: components["responses"]["openapi_components_responses_Problem"];
            500: components["responses"]["openapi_components_responses_Problem"];
        };
    };
    createPatient: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePatientRequest"];
            };
        };
        responses: {
            /** @description Paciente criado */
            201: {
                headers: {
                    /** @description Caminho do novo recurso */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PatientCreatedResponse"];
                };
            };
            400: components["responses"]["openapi_components_responses_Problem"];
            401: components["responses"]["openapi_components_responses_Problem"];
            422: components["responses"]["openapi_components_responses_Problem"];
            500: components["responses"]["openapi_components_responses_Problem"];
        };
    };
    getPatient: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador do paciente */
                patientId: components["parameters"]["openapi_components_parameters_PatientId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Patient"];
                };
            };
            400: components["responses"]["openapi_components_responses_Problem"];
            401: components["responses"]["openapi_components_responses_Problem"];
            404: components["responses"]["openapi_components_responses_Problem"];
            500: components["responses"]["openapi_components_responses_Problem"];
        };
    };
    uploadExamDocument: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador do paciente */
                patientId: components["parameters"]["PatientId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: date */
                    collection_date?: string;
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Documento recebido e classificado */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExamDocument"];
                };
            };
            400: components["responses"]["Problem"];
            401: components["responses"]["Problem"];
            403: components["responses"]["Problem"];
            413: components["responses"]["Problem"];
            415: components["responses"]["Problem"];
            500: components["responses"]["Problem"];
        };
    };
    listPatientLabReports: {
        parameters: {
            query?: {
                expand?: "full";
                include?: string;
                /** @description Número máximo de itens */
                limit?: components["parameters"]["LimitParam"];
                /** @description Número de itens para pular */
                offset?: components["parameters"]["OffsetParam"];
            };
            header?: never;
            path: {
                /** @description Identificador do paciente */
                patientId: components["parameters"]["PatientId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Laudos do paciente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LabsList"];
                };
            };
            400: components["responses"]["Problem"];
            401: components["responses"]["Problem"];
            403: components["responses"]["Problem"];
            500: components["responses"]["Problem"];
        };
    };
    listPatientLabs: {
        parameters: {
            query?: {
                /** @description Retorna a representação completa quando expand=full */
                expand?: "full";
                /** @description Lista de campos para expandir (ex.: results) */
                include?: string;
                /** @description Número máximo de itens */
                limit?: components["parameters"]["LimitParam"];
                /** @description Número de itens para pular */
                offset?: components["parameters"]["OffsetParam"];
            };
            header?: never;
            path: {
                /** @description Identificador do paciente */
                patientId: components["parameters"]["PatientId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LabsList"];
                };
            };
            400: components["responses"]["Problem"];
            401: components["responses"]["Problem"];
            500: components["responses"]["Problem"];
        };
    };
    uploadPatientLab: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador do paciente */
                patientId: components["parameters"]["PatientId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Laudo criado */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LabUploadResponse"];
                };
            };
            400: components["responses"]["Problem"];
            401: components["responses"]["Problem"];
            413: components["responses"]["Problem"];
            415: components["responses"]["Problem"];
            500: components["responses"]["Problem"];
        };
    };
}
