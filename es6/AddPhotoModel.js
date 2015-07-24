/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury" />
/// <reference path="../mixins/EditMixin.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
'use strict';
App.AddPhotoModel = Em.Object.extend({
    title: null,
    sectionIndex: null,
    photoData: null,
    photoImage: null,
    photoName: null,
    photoExtension: null
});
App.AddPhotoModel.separateFileNameAndExtension = function (fileName) {
    var name = fileName.substr(0, fileName.lastIndexOf('.')), extension = fileName.substr(fileName.lastIndexOf('.') + 1), fileNameSeparated = { name: name, extension: extension };
    return fileNameSeparated;
};
App.AddPhotoModel.reopenClass(App.EditMixin, {
    load: function (title, sectionIndex, photoData) {
        return new Em.RSVP.Promise(function (resolve, reject) {
            var oFReader = new FileReader();
            oFReader.readAsDataURL(photoData);
            oFReader.onload = function (oFREvent) {
                var separatedName = App.AddPhotoModel.separateFileNameAndExtension(photoData.name), photoName = separatedName.name, photoExtension = separatedName.extension;
                resolve(App.AddPhotoModel.create({
                    title: title,
                    sectionIndex: sectionIndex,
                    photoData: photoData,
                    photoImage: oFREvent.target.result,
                    photoName: photoName,
                    photoExtension: photoExtension
                }));
            };
            oFReader.onerror = function (OFREvent) {
                reject();
            };
        });
    },
    addToContent: function (uploadedPhotoTitle, model) {
        var _this = this;
        var photoWikiText = '\n[[File:' + uploadedPhotoTitle + '|thumb]]\n', editData = {
            action: 'edit',
            title: model.title,
            section: model.sectionIndex,
            format: 'json',
            appendtext: photoWikiText,
            token: ''
        };
        return new Em.RSVP.Promise(function (resolve, reject) {
            _this.getEditToken(model.title).then(function (token) {
                editData.token = token;
                _this.editContent(editData).then(resolve, reject);
            }, function (err) {
                reject(err);
            });
        });
    },
    editContent: function (editData) {
        return new Em.RSVP.Promise(function (resolve, reject) {
            Em.$.ajax({
                url: M.buildUrl({ path: '/api.php' }),
                dataType: 'json',
                method: 'POST',
                data: editData,
                success: function (resp) {
                    if (resp && resp.edit && resp.edit.result === 'Success') {
                        resolve();
                    }
                    else if (resp && resp.error) {
                        reject(resp.error.code);
                    }
                    else {
                        reject();
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    },
    upload: function (model) {
        var _this = this;
        return new Em.RSVP.Promise(function (resolve, reject) {
            _this.temporaryUpload(model.photoData).then(function (addmediatemporary) {
                if (addmediatemporary.tempName === undefined) {
                    return resolve({ 'title': addmediatemporary.title });
                }
                //If a user inputs an empty image name, then we silently replace it with original file name.
                var newPhotoTitle;
                if (model.photoName.trim().length === 0) {
                    newPhotoTitle = model.photoData.name;
                }
                else {
                    newPhotoTitle = model.photoName.trim() + '.' + model.photoExtension;
                }
                _this.permanentUpload(newPhotoTitle, addmediatemporary.tempName).then(resolve, reject);
            }, function (err) {
                reject(err);
            });
        });
    },
    permanentUpload: function (photoTitle, tempName) {
        return new Em.RSVP.Promise(function (resolve, reject) {
            var params = {
                action: 'addmediapermanent',
                format: 'json',
                title: photoTitle,
                tempName: tempName
            };
            Em.$.ajax({
                url: M.buildUrl({ path: '/api.php' }),
                method: 'POST',
                data: params,
                success: function (resp) {
                    if (resp && resp.addmediapermanent) {
                        resolve(resp.addmediapermanent);
                    }
                    else if (resp && resp.error) {
                        reject(resp.error.code);
                    }
                    else {
                        reject();
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    },
    temporaryUpload: function (photoData) {
        var formData = new FormData();
        formData.append('file', photoData);
        return new Em.RSVP.Promise(function (resolve, reject) {
            Em.$.ajax({
                url: M.buildUrl({
                    path: '/api.php',
                    query: {
                        action: 'addmediatemporary',
                        format: 'json'
                    }
                }),
                method: 'POST',
                data: formData,
                cache: false,
                xhrFields: {
                    withCredentials: true
                },
                contentType: false,
                processData: false,
                success: function (resp) {
                    if (resp && resp.addmediatemporary) {
                        resolve(resp.addmediatemporary);
                    }
                    else if (resp && resp.error) {
                        reject(resp.error.code);
                    }
                    else {
                        reject();
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }
});
