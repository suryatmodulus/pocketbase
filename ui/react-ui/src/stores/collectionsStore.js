import { create } from 'zustand';
import ApiClient from '../../../src/utils/ApiClient'; // Adjust path as needed
import CommonHelper from '../../../src/utils/CommonHelper'; // Adjust path as needed

const useCollectionsStore = create((set, get) => ({
  collections: [],
  activeCollection: {},
  isCollectionsLoading: false,
  protectedFilesCollectionsCache: {}, // collectionId:bool
  scaffolds: {}, // collectionId:object

  changeActiveCollectionByIdOrName: (idOrName) => {
    const collections = get().collections;
    let collectionToActivate = null;

    if (idOrName) {
      collectionToActivate = collections.find(c => c.id === idOrName || c.name === idOrName) || null;
    }

    set({ activeCollection: collectionToActivate || {} });
    // console.log('Active collection changed', get().activeCollection); // For debugging
  },

  addCollection: (collection) => {
    if (!collection || !collection.id) {
      return;
    }
    set((state) => ({
      collections: [...state.collections.filter(c => c.id !== collection.id), collection].sort(CommonHelper.sortCollections),
    }));
    // notifyOtherTabs(COLLECTIONS_KEY); // Omitted for now
  },

  removeCollection: (collection) => {
    if (!collection || !collection.id) {
      return;
    }
    set((state) => ({
      collections: state.collections.filter(c => c.id !== collection.id),
    }));
    if (get().activeCollection?.id === collection.id) {
      set({ activeCollection: {} });
    }
    // notifyOtherTabs(COLLECTIONS_KEY); // Omitted for now
  },

  loadCollections: async (activeIdOrName = null, disableCache = false) => {
    if (!disableCache && get().collections.length) {
      get().changeActiveCollectionByIdOrName(activeIdOrName);
      return; // Already loaded
    }

    set({ isCollectionsLoading: true });

    try {
      const result = await ApiClient.collections.getFullList(200, { '$autoCancel': false });
      const loadedCollections = CommonHelper.sortCollections(result || []);
      set({ collections: loadedCollections });
      get().changeActiveCollectionByIdOrName(activeIdOrName);
      // notifyOtherTabs(COLLECTIONS_KEY); // Omitted for now
    } catch (err) {
      ApiClient.errorResponseLog(err);
      // TODO: Consider how to handle errors in Zustand, maybe set an error state
    } finally {
      set({ isCollectionsLoading: false });
    }
  },

  refreshProtectedFilesCollectionsCache: async () => {
    set({ isCollectionsLoading: true }); // Reuse loading state or add a specific one?
    try {
      const result = await ApiClient.collections.getFullList(200, {
        '$autoCancel': false,
        'filter': 'schema.0.type!="file" || schema.0.options.protected!=false', // query for file fields that are protected
        'fields': 'id,name,schema', // only fetch necessary fields
      });
      const cache = {};
      for (const collection of result) {
        if (collection.schema) {
          for (const field of collection.schema) {
            if (field.type === 'file' && field.options && field.options.protected) {
              cache[collection.id] = true;
              break;
            }
          }
        }
      }
      set({ protectedFilesCollectionsCache: cache });
    } catch (err) {
      ApiClient.errorResponseLog(err);
    } finally {
      set({ isCollectionsLoading: false }); // Reuse loading state or add a specific one?
    }
  },

  // Scaffolds related functions - can be added if needed by other parts of the UI
  // For now, scaffolds state is initialized but not actively managed by specific functions in this store.
  // loadScaffolds: async () => { ... }
  // addScaffold: (collectionId, scaffold) => { ... }
  // removeScaffold: (collectionId) => { ... }
}));

export default useCollectionsStore;

// const COLLECTIONS_KEY = 'pb_collections'; // For BroadcastChannel, omitted for now
// const notifyChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(COLLECTIONS_KEY) : null; // Omitted

// if (notifyChannel) { // Omitted
//     notifyChannel.onmessage = (event) => {
//         if (event.data === COLLECTIONS_KEY) {
//             useCollectionsStore.getState().loadCollections(
//                 useCollectionsStore.getState().activeCollection?.id,
//                 true // disableCache
//             );
//         }
//     };
// }

// function notifyOtherTabs(key) { // Omitted
//     if (notifyChannel) {
//         notifyChannel.postMessage(key);
//     }
// }
