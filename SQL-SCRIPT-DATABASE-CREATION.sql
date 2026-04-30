CREATE TABLE Tenants (
    tenant_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    tenant_name NVARCHAR(255) NOT NULL,
    owner_user_id UNIQUEIDENTIFIER,
    status NVARCHAR(50) DEFAULT 'active',
    subscription_type NVARCHAR(50) DEFAULT 'basic',
    subscription_start_date DATETIME,
    subscription_end_date DATETIME,
    max_users INT DEFAULT 50,
    allow_cross_tenant_transactions BIT DEFAULT 0,
    phone NVARCHAR(20),
    email NVARCHAR(255),
    address NVARCHAR(MAX),
    city NVARCHAR(100),
    province NVARCHAR(100),
    postal_code NVARCHAR(20),
    country NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_Tenants PRIMARY KEY (tenant_id)
);

CREATE UNIQUE INDEX UX_Tenants_Name ON Tenants(tenant_name);
CREATE INDEX IX_Tenants_Status ON Tenants(status);


CREATE TABLE Users (
    user_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) NOT NULL UNIQUE,
    phone NVARCHAR(20),
    first_name NVARCHAR(100),
    last_name NVARCHAR(100),
    password_hash NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(50) DEFAULT 'active',
    is_verified BIT DEFAULT 0,
    is_email_verified BIT DEFAULT 0,
    is_phone_verified BIT DEFAULT 0,
    last_login DATETIME,
    last_password_change DATETIME,
    two_factor_enabled BIT DEFAULT 0,
    two_factor_method NVARCHAR(50),
    profile_picture_url NVARCHAR(MAX),
    national_id NVARCHAR(50),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_Users PRIMARY KEY (user_id)
);

CREATE INDEX IX_Users_Email ON Users(email);
CREATE INDEX IX_Users_Status ON Users(status);
CREATE INDEX IX_Users_Phone ON Users(phone);


CREATE TABLE Roles (
    role_id INT PRIMARY KEY IDENTITY(1,1),
    role_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    color_code NVARCHAR(10),
    icon_name NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_Roles PRIMARY KEY (role_id),
    CONSTRAINT UK_Roles_Name UNIQUE (role_name)
);

CREATE TABLE RoleLevels (
    role_level_id INT PRIMARY KEY IDENTITY(1,1),
    role_id INT NOT NULL,
    level_number INT NOT NULL,
    level_name NVARCHAR(100),
    description NVARCHAR(MAX),
    max_transaction_amount DECIMAL(18, 2),
    max_daily_transaction_count INT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_RoleLevels PRIMARY KEY (role_level_id),
    CONSTRAINT FK_RoleLevel_Role FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE,
    CONSTRAINT UK_RoleLevel_Unique UNIQUE (role_id, level_number)
);

CREATE INDEX IX_RoleLevels_RoleId ON RoleLevels(role_id);


CREATE TABLE UserTenantRoles (
    user_tenant_role_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    role_id INT NOT NULL,
    role_level_id INT NOT NULL,
    is_primary_tenant BIT DEFAULT 0,
    status NVARCHAR(50) DEFAULT 'active',
    assigned_at DATETIME DEFAULT GETDATE(),
    assigned_by_user_id UNIQUEIDENTIFIER,
    
    CONSTRAINT PK_UserTenantRoles PRIMARY KEY (user_tenant_role_id),
    CONSTRAINT FK_UTR_User FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_UTR_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id) ON DELETE CASCADE,
    CONSTRAINT FK_UTR_Role FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    CONSTRAINT FK_UTR_RoleLevel FOREIGN KEY (role_level_id) REFERENCES RoleLevels(role_level_id),
    CONSTRAINT FK_UTR_AssignedBy FOREIGN KEY (assigned_by_user_id) REFERENCES Users(user_id),
    CONSTRAINT UK_UTR_Unique UNIQUE (user_id, tenant_id, role_id)
);

CREATE INDEX IX_UTR_User ON UserTenantRoles(user_id);
CREATE INDEX IX_UTR_Tenant ON UserTenantRoles(tenant_id);
CREATE INDEX IX_UTR_Role ON UserTenantRoles(role_id);
CREATE INDEX IX_UTR_RoleLevel ON UserTenantRoles(role_level_id);


CREATE TABLE Sessions (
    session_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    role_id INT NOT NULL,
    role_level_id INT NOT NULL,
    access_token NVARCHAR(MAX),
    refresh_token NVARCHAR(MAX),
    login_time DATETIME DEFAULT GETDATE(),
    last_activity DATETIME DEFAULT GETDATE(),
    expires_at DATETIME,
    ip_address NVARCHAR(45),
    user_agent NVARCHAR(MAX),
    device_id NVARCHAR(255),
    status NVARCHAR(50) DEFAULT 'active',
    revoked_at DATETIME,
    revoked_reason NVARCHAR(255),
    
    CONSTRAINT PK_Sessions PRIMARY KEY (session_id),
    CONSTRAINT FK_Session_User FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_Session_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id),
    CONSTRAINT FK_Session_Role FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    CONSTRAINT FK_Session_RoleLevel FOREIGN KEY (role_level_id) REFERENCES RoleLevels(role_level_id)
);

CREATE INDEX IX_Session_User ON Sessions(user_id);
CREATE INDEX IX_Session_Tenant ON Sessions(tenant_id);
CREATE INDEX IX_Session_Status ON Sessions(status);
CREATE INDEX IX_Session_ExpiresAt ON Sessions(expires_at);


CREATE TABLE Permissions (
    permission_id INT PRIMARY KEY IDENTITY(1,1),
    permission_name NVARCHAR(255) NOT NULL, 
    description NVARCHAR(MAX),
    catery NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_Permissions PRIMARY KEY (permission_id),
    CONSTRAINT UK_Permissions_Name UNIQUE (permission_name)
);

CREATE TABLE RoleLevelPermissions (
    role_level_permission_id INT PRIMARY KEY IDENTITY(1,1),
    role_level_id INT NOT NULL,
    permission_id INT NOT NULL,
    
    CONSTRAINT PK_RoleLevelPermissions PRIMARY KEY (role_level_permission_id),
    CONSTRAINT FK_RLP_RoleLevel FOREIGN KEY (role_level_id) REFERENCES RoleLevels(role_level_id) ON DELETE CASCADE,
    CONSTRAINT FK_RLP_Permission FOREIGN KEY (permission_id) REFERENCES Permissions(permission_id),
    CONSTRAINT UK_RoleLevelPermission_Unique UNIQUE (role_level_id, permission_id)
);

CREATE INDEX IX_RLP_RoleLevel ON RoleLevelPermissions(role_level_id);
CREATE INDEX IX_RLP_Permission ON RoleLevelPermissions(permission_id);


CREATE TABLE Metals (
    metal_id INT PRIMARY KEY IDENTITY(1,1),
    metal_name NVARCHAR(100) NOT NULL,
    metal_symbol NVARCHAR(10) NOT NULL,
    atomic_number INT,
    created_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_Metals PRIMARY KEY (metal_id),
    CONSTRAINT UK_Metals_Name UNIQUE (metal_name),
    CONSTRAINT UK_Metals_Symbol UNIQUE (metal_symbol)
);

CREATE TABLE Products (
    product_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    product_name NVARCHAR(255),
    metal_id INT NOT NULL,
    purity INT NOT NULL,
    purity_percentage DECIMAL(5, 2),
    description NVARCHAR(MAX),
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_Products PRIMARY KEY (product_id),
    CONSTRAINT FK_Product_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id) ON DELETE CASCADE,
    CONSTRAINT FK_Product_Metal FOREIGN KEY (metal_id) REFERENCES Metals(metal_id)
);

CREATE INDEX IX_Product_Tenant ON Products(tenant_id);
CREATE INDEX IX_Product_Metal ON Products(metal_id);
CREATE INDEX IX_Product_Active ON Products(is_active);


CREATE TABLE Wallets (
    wallet_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    wallet_balance DECIMAL(18, 2) DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_Wallets PRIMARY KEY (wallet_id),
    CONSTRAINT FK_Wallet_User FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_Wallet_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id),
    CONSTRAINT UK_Wallet_User_Tenant UNIQUE (user_id, tenant_id)
);

CREATE INDEX IX_Wallet_User ON Wallets(user_id);
CREATE INDEX IX_Wallet_Tenant ON Wallets(tenant_id);


CREATE TABLE WalletMetals (
    wallet_metal_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    wallet_id UNIQUEIDENTIFIER NOT NULL,
    product_id UNIQUEIDENTIFIER NOT NULL,
    quantity DECIMAL(18, 6) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(18, 6) DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_WalletMetals PRIMARY KEY (wallet_metal_id),
    CONSTRAINT FK_WalletMetal_Wallet FOREIGN KEY (wallet_id) REFERENCES Wallets(wallet_id) ON DELETE CASCADE,
    CONSTRAINT FK_WalletMetal_Product FOREIGN KEY (product_id) REFERENCES Products(product_id),
    CONSTRAINT UK_WalletMetal_Unique UNIQUE (wallet_id, product_id)
);

CREATE INDEX IX_WalletMetal_Wallet ON WalletMetals(wallet_id);
CREATE INDEX IX_WalletMetal_Product ON WalletMetals(product_id);


CREATE TABLE Transactions (
    transaction_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    transaction_type NVARCHAR(50) NOT NULL,
    from_user_id UNIQUEIDENTIFIER,
    to_user_id UNIQUEIDENTIFIER,
    product_id UNIQUEIDENTIFIER,
    quantity DECIMAL(18, 6),
    unit_price DECIMAL(18, 2),
    total_amount DECIMAL(18, 2),
    payment_method NVARCHAR(50),
    status NVARCHAR(50) DEFAULT 'pending',
    reference_number NVARCHAR(255),
    invoice_number NVARCHAR(50),
    description NVARCHAR(MAX),
    notes NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    completed_at DATETIME,
    cancelled_at DATETIME,
    cancelled_reason NVARCHAR(MAX),
    created_by_user_id UNIQUEIDENTIFIER,
    approved_by_user_id UNIQUEIDENTIFIER,
    approved_at DATETIME,
    
    CONSTRAINT PK_Transactions PRIMARY KEY (transaction_id),
    CONSTRAINT FK_Transaction_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id) ON DELETE CASCADE,
    CONSTRAINT FK_Transaction_FromUser FOREIGN KEY (from_user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Transaction_ToUser FOREIGN KEY (to_user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Transaction_Product FOREIGN KEY (product_id) REFERENCES Products(product_id),
    CONSTRAINT FK_Transaction_CreatedBy FOREIGN KEY (created_by_user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Transaction_ApprovedBy FOREIGN KEY (approved_by_user_id) REFERENCES Users(user_id)
);

CREATE INDEX IX_Transaction_Tenant ON Transactions(tenant_id);
CREATE INDEX IX_Transaction_FromUser ON Transactions(from_user_id);
CREATE INDEX IX_Transaction_ToUser ON Transactions(to_user_id);
CREATE INDEX IX_Transaction_Status ON Transactions(status);
CREATE INDEX IX_Transaction_Type ON Transactions(transaction_type);
CREATE INDEX IX_Transaction_CreatedAt ON Transactions(created_at);
CREATE INDEX IX_Transaction_ReferenceNumber ON Transactions(reference_number);


CREATE TABLE TransactionItems (
    transaction_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    transaction_id UNIQUEIDENTIFIER NOT NULL,
    product_id UNIQUEIDENTIFIER NOT NULL,
    quantity DECIMAL(18, 6),
    unit_price DECIMAL(18, 2),
    line_total DECIMAL(18, 2),
    
    CONSTRAINT PK_TransactionItems PRIMARY KEY (transaction_item_id),
    CONSTRAINT FK_TxnItem_Transaction FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ON DELETE CASCADE,
    CONSTRAINT FK_TxnItem_Product FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE INDEX IX_TransactionItems_Transaction ON TransactionItems(transaction_id);

CREATE TABLE TenantPermissionSettings (
    setting_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    setting_key NVARCHAR(255),
    setting_value NVARCHAR(MAX),
    description NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_TenantSettings PRIMARY KEY (setting_id),
    CONSTRAINT FK_TenantSettings_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id) ON DELETE CASCADE,
    CONSTRAINT UK_TenantSettings_Key UNIQUE (tenant_id, setting_key)
);

CREATE TABLE AuditLog (
    audit_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    user_id UNIQUEIDENTIFIER,
    action NVARCHAR(255),
    entity_type NVARCHAR(100),
    entity_id NVARCHAR(MAX),
    old_value NVARCHAR(MAX),
    new_value NVARCHAR(MAX),
    ip_address NVARCHAR(45),
    user_agent NVARCHAR(MAX),
    status NVARCHAR(50),
    error_message NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_AuditLog PRIMARY KEY (audit_id),
    CONSTRAINT FK_Audit_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id),
    CONSTRAINT FK_Audit_User FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE INDEX IX_AuditLog_Tenant ON AuditLog(tenant_id);
CREATE INDEX IX_AuditLog_User ON AuditLog(user_id);
CREATE INDEX IX_AuditLog_CreatedAt ON AuditLog(created_at);
CREATE INDEX IX_AuditLog_EntityType ON AuditLog(entity_type);


CREATE TABLE ApiLog (
    api_log_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER,
    tenant_id UNIQUEIDENTIFIER,
    api_endpoint NVARCHAR(500),
    http_method NVARCHAR(10),
    request_body NVARCHAR(MAX),
    response_body NVARCHAR(MAX),
    status_code INT,
    execution_time_ms INT,
    ip_address NVARCHAR(45),
    user_agent NVARCHAR(MAX),
    error_message NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_ApiLog PRIMARY KEY (api_log_id),
    CONSTRAINT FK_ApiLog_User FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_ApiLog_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id)
);

CREATE INDEX IX_ApiLog_TenantUser ON ApiLog(tenant_id, user_id);
CREATE INDEX IX_ApiLog_CreatedAt ON ApiLog(created_at);


CREATE TABLE NotificationPreferences (
    preference_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    notification_type NVARCHAR(100),
    is_enabled BIT DEFAULT 1,
    frequency NVARCHAR(50),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT PK_NotificationPrefs PRIMARY KEY (preference_id),
    CONSTRAINT FK_NotifPref_User FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_NotifPref_Tenant FOREIGN KEY (tenant_id) REFERENCES Tenants(tenant_id),
    CONSTRAINT UK_NotifPref_Unique UNIQUE (user_id, tenant_id, notification_type)
);


CREATE INDEX IX_Transactions_Tenant_Status ON Transactions(tenant_id, status, created_at DESC);
CREATE INDEX IX_WalletMetals_Wallet_Product ON WalletMetals(wallet_id, product_id);
CREATE INDEX IX_AuditLog_Tenant_CreatedAt ON AuditLog(tenant_id, created_at DESC);
CREATE INDEX IX_Sessions_User_Tenant ON Sessions(user_id, tenant_id, status);

