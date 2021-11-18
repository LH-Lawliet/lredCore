utils = {
    stringedFunctions={}
}


function utils:vect3ToTable(vect)
    return {x=vect.x,y=vect.y,z=vect.z}
end

function utils:degToRad(deg)
    return deg*0.01745329
end

function utils:round(number, decimals)
    if number then
        local mult = 10^(decimals or 0)
        return math.floor(number * mult + 0.5) / mult
    else
        return nil
    end
end


function utils:toInt(n)
    local s = tostring(n)
    local i, j = s:find('%.')
    if i then
        return tonumber(s:sub(1, i-1))
    else
        return n
    end
end


function utils:copy(obj)
    if type(obj) ~= 'table' then return obj end
    local res = {}
    for k, v in pairs(obj) do res[self:copy(k)] = self:copy(v) end
    return res
end

-- Save copied tables in `copies`, indexed by original table.
function utils:deepcopy(orig, copies)
    copies = copies or {}
    local orig_type = type(orig)
    local copy
    if orig_type == 'table' then
        if copies[orig] then
            copy = copies[orig]
        else
            copy = {}
            copies[orig] = copy
            for orig_key, orig_value in next, orig, nil do
                copy[self:deepcopy(orig_key, copies)] = self:deepcopy(orig_value, copies)
            end
            setmetatable(copy, self:deepcopy(getmetatable(orig), copies))
        end
    else -- number, string, boolean, etc
        copy = orig
    end
    return copy
end

function utils:setToJsonable(obj, n)
    n = n or 0
    n = n+1
    for k, v in pairs(obj) do
        if type(v) == "table" then
            if n<10 then
                obj[k] = self:setToJsonable(v,n)
            else
                obj[k] = "table too far... (probably infinite loop due to class)"
            end
        elseif type(v) == "function" then
            obj[k]=utils:registerNewStringedFunction(obj[k])
        end
    end
    return obj
end

function utils:registerNewStringedFunction(funct)
    local stringed = tostring(funct)
    if not utils:getStringedFunction(stringed, true) then
        table.insert(self.stringedFunctions, {str = stringed, funct = funct})
    end
    return stringed
end

function utils:getStringedFunction(str, notAlert)
    for k,functTable in pairs(self.stringedFunctions) do
        if functTable.str==str then
            return functTable.funct
        end
    end
    
    if not notAlert then
        print('ERROR : utils:getStringedFunction didn\'t find corresponding function with adress : ',str )
    end
    return nil
end

function utils:tableMerge(t1, t2)
    for k,v in pairs(t2) do
        if type(v) == "table" then
            if type(t1[k] or false) == "table" then
                tableMerge(t1[k] or {}, t2[k] or {})
            else
                t1[k] = v
            end
        else
            t1[k] = v
        end
    end
    return t1
end

function utils:randomInTable(tb)
    local keys = {}
    for k in pairs(tb) do table.insert(keys, k) end
    return tb[keys[math.random(#keys)]]
end


function utils:inverseModulo(a,b)
    return (a-(a%b))/b
end

function utils:isInTable(toTest, table)
    if type(toTest) == "table" then
        for k, tested in pairs(table) do
            if self:isInTable(tested, toTest) then
                return true
            end
        end
        return false
    else
        for k, tested in pairs(table) do
            if tested == toTest then
                return true
            end
        end
        return false
    end
end


function utils:getIndex(toTest, table)
    for k, tested in pairs(table) do
        if tested == toTest then
            return k
        end
    end
    return false
end


local charset = {}
for c = 33, 126  do table.insert(charset, string.char(c)) end
table.remove(charset, 62) -- remove '^' char

function utils:randomString(length)
    if not length or length <= 0 then return '' end
    return self:randomString(length - 1) .. charset[math.random(1, #charset)]
end

function utils:stringSplit(inputstr, sep)
    if sep == nil then
        sep = "%s"
    end
    local t={}
    for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
        table.insert(t, str)
    end
    return t
end