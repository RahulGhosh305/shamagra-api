import Joi from "joi";
import { validate } from "@utils/validate";

const getBanners = validate({
    query: Joi.object({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});

const getBanner = validate({
    params: Joi.object({
        id: Joi.string().required(),
    })
});

const addBanner = validate({
    body: Joi.object({
        name: Joi.string().required(),
        photo: Joi.string().required(),
        page: Joi.string().optional(),
        description: Joi.string().required(),
        position: Joi.number().required(),
        bannerPlace: Joi.string().required(),
        status: Joi.string().required(),
    })
});

const updateBanner = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
        page: Joi.string().optional(),
        photo: Joi.string().required(),
        description: Joi.string().required(),
        position: Joi.number().required(),
        bannerPlace: Joi.string().required(),
        status: Joi.string().required(),
    })
});

const deleteBanner = validate({
    params: Joi.object({
        id: Joi.string().required(),
    })
});

const getCategories = validate({
    query: Joi.object({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});

const getCategory = validate({
    params: Joi.object({
        id: Joi.string().required(),
    })
});

const addCategory = validate({
    body: Joi.object({
        name: Joi.string().required(),
        isDisabled: Joi.boolean().required(),
        position: Joi.number().required(),
        description: Joi.string().required().allow(null).allow(""),
        status: Joi.string().required(),
    })
});

const updateCategory = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
        isDisabled: Joi.boolean().required(),
        position: Joi.number().required(),
        description: Joi.string().required().allow(null).allow(""),
        status: Joi.string().required(),
    })
});

const deleteCategory = validate({
    params: Joi.object({
        id: Joi.string().required(),
    })
});

const getAuthors = validate({
    query: Joi.object({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});

const getAuthor = validate({
    params: Joi.object({
        id: Joi.string().required(),
    })
});

const addAuthor = validate({
    body: Joi.object({
        name: Joi.string().required(),
        isDisabled: Joi.boolean().required(),
        position: Joi.number().required(),
        description: Joi.string().required().allow(null).allow(""),
        status: Joi.string().required(),
    })
});

const updateAuthor = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
        isDisabled: Joi.boolean().required(),
        position: Joi.number().required(),
        description: Joi.string().required().allow(null).allow(""),
        status: Joi.string().required(),
    })
});

const deleteAuthor = validate({
    params: Joi.object({
        id: Joi.string().required(),
    })
});

const getSubCategories = validate({
    query: Joi.object({
        page: Joi.string().optional(),
        perPage: Joi.string().optional(),
    })
});

const getSubCategory = validate({
    params: Joi.object({
        id: Joi.string().required(),
    })
});

const addSubCategory = validate({
    body: Joi.object({
        categoryId: Joi.string().required(),
        name: Joi.string().required(),
        photo: Joi.string().required().allow(null).allow(""),
        color: Joi.string().required().allow(null).allow(""),
        description: Joi.string().required().allow(null).allow(""),
        status: Joi.string().required(),
    })
});

const updateSubCategory = validate({
    body: Joi.object({
        _id: Joi.string().required(),
        categoryId: Joi.string().required(),
        name: Joi.string().required(),
        photo: Joi.string().required().allow(null).allow(""),
        color: Joi.string().required().allow(null).allow(""),
        description: Joi.string().required().allow(null).allow(""),
        status: Joi.string().required(),
    })
});

const deleteSubCategory = validate({
    params: Joi.object({
        id: Joi.string().required(),
    })
});


export {
    getBanners,
    getBanner,
    addBanner,
    updateBanner,
    deleteBanner,

    getCategories,
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory,

    getAuthors,
    getAuthor,
    addAuthor,
    updateAuthor,
    deleteAuthor,

    getSubCategories,
    getSubCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
}
